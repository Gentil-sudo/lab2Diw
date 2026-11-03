package br.pucminas.aluguel.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucminas.aluguel.dto.AjustePedidoRequest;
import br.pucminas.aluguel.dto.AvaliacaoRequest;
import br.pucminas.aluguel.dto.PedidoRequest;
import br.pucminas.aluguel.dto.PedidoResponse;
import br.pucminas.aluguel.exception.AcessoNegadoException;
import br.pucminas.aluguel.exception.RecursoNaoEncontradoException;
import br.pucminas.aluguel.exception.RegraNegocioException;
import br.pucminas.aluguel.model.Agente;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Pedido;
import br.pucminas.aluguel.model.StatusPedido;
import br.pucminas.aluguel.repository.AgenteRepository;
import br.pucminas.aluguel.repository.AutomovelRepository;
import br.pucminas.aluguel.repository.ClienteRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import br.pucminas.aluguel.security.UsuarioLogado;

@Service
public class PedidoService {

    private static final List<StatusPedido> STATUS_ATIVOS =
            List.of(StatusPedido.EM_ANALISE, StatusPedido.APROVADO, StatusPedido.CONTRATADO);

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
            AutomovelRepository automovelRepository, AgenteRepository agenteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
        this.agenteRepository = agenteRepository;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(UsuarioLogado usuario, StatusPedido status) {
        List<Pedido> pedidos;
        if (usuario.isCliente()) {
            pedidos = pedidoRepository.findByClienteIdOrderByDataCriacaoDesc(usuario.id());
        } else if (status != null) {
            pedidos = pedidoRepository.findByStatusOrderByDataCriacaoDesc(status);
        } else {
            pedidos = pedidoRepository.findAllByOrderByDataCriacaoDesc();
        }
        return pedidos.stream().map(PedidoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(Long id, UsuarioLogado usuario) {
        Pedido pedido = buscarPedido(id);
        if (usuario.isCliente() && !pedido.getCliente().getId().equals(usuario.id())) {
            throw new AcessoNegadoException("Você só pode ver os seus próprios pedidos");
        }
        return PedidoResponse.from(pedido);
    }

    @Transactional
    public PedidoResponse criar(PedidoRequest dados, UsuarioLogado usuario) {
        Cliente cliente = clienteRepository.findById(usuario.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        aplicarPeriodo(pedido, buscarAutomovel(dados.automovelId()), dados.dataInicio(), dados.dataFim());
        pedido.setValor(calcularValor(pedido));

        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse modificar(Long id, PedidoRequest dados, UsuarioLogado usuario) {
        Pedido pedido = buscarPedidoDoCliente(id, usuario);
        exigirEmAnalise(pedido, "modificar");
        aplicarPeriodo(pedido, buscarAutomovel(dados.automovelId()), dados.dataInicio(), dados.dataFim());
        pedido.setValor(calcularValor(pedido));
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse cancelar(Long id, UsuarioLogado usuario) {
        Pedido pedido = buscarPedidoDoCliente(id, usuario);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE && pedido.getStatus() != StatusPedido.APROVADO) {
            throw new RegraNegocioException("Só é possível cancelar pedidos em análise ou aprovados");
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    // O agente pode ajustar o período e negociar o valor antes de dar o parecer.
    @Transactional
    public PedidoResponse ajustar(Long id, AjustePedidoRequest dados) {
        Pedido pedido = buscarPedido(id);
        exigirEmAnalise(pedido, "ajustar");
        aplicarPeriodo(pedido, pedido.getAutomovel(), dados.dataInicio(), dados.dataFim());
        pedido.setValor(dados.valor());
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    // Parecer financeiro: positivo aprova (segue para contrato), negativo reprova de vez.
    @Transactional
    public PedidoResponse avaliar(Long id, AvaliacaoRequest dados, UsuarioLogado usuario) {
        Pedido pedido = buscarPedido(id);
        exigirEmAnalise(pedido, "avaliar");

        Agente agente = agenteRepository.findById(usuario.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agente não encontrado"));

        pedido.setStatus(dados.aprovado() ? StatusPedido.APROVADO : StatusPedido.REPROVADO);
        pedido.setParecer(dados.parecer().trim());
        pedido.setAgenteAvaliador(agente);
        pedido.setDataAvaliacao(LocalDateTime.now());
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    // Valida as datas e confere se o carro está livre no período antes de aplicar no pedido.
    private void aplicarPeriodo(Pedido pedido, Automovel automovel, LocalDate inicio, LocalDate fim) {
        if (!fim.isAfter(inicio)) {
            throw new RegraNegocioException("A data de devolução deve ser depois da data de início");
        }
        if (inicio.isBefore(LocalDate.now())) {
            throw new RegraNegocioException("A data de início não pode estar no passado");
        }

        Long ignorar = pedido.getId() != null ? pedido.getId() : -1L;
        if (pedidoRepository.existeReservaNoPeriodo(automovel.getId(), inicio, fim, STATUS_ATIVOS, ignorar)) {
            throw new RegraNegocioException("Esse automóvel já está reservado nesse período");
        }

        pedido.setAutomovel(automovel);
        pedido.setDataInicio(inicio);
        pedido.setDataFim(fim);
    }

    private double calcularValor(Pedido pedido) {
        if (pedido.getAutomovel().getValorDiaria() == null) {
            throw new RegraNegocioException("Esse automóvel ainda não tem valor de diária cadastrado");
        }
        long dias = ChronoUnit.DAYS.between(pedido.getDataInicio(), pedido.getDataFim());
        return dias * pedido.getAutomovel().getValorDiaria();
    }

    private void exigirEmAnalise(Pedido pedido, String acao) {
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new RegraNegocioException("Só é possível " + acao + " pedidos que estão em análise");
        }
    }

    private Automovel buscarAutomovel(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Automóvel não encontrado"));
    }

    private Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado"));
    }

    private Pedido buscarPedidoDoCliente(Long id, UsuarioLogado usuario) {
        Pedido pedido = buscarPedido(id);
        if (!pedido.getCliente().getId().equals(usuario.id())) {
            throw new AcessoNegadoException("Você só pode alterar os seus próprios pedidos");
        }
        return pedido;
    }
}
