package br.pucminas.aluguel.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucminas.aluguel.dto.ContratoRequest;
import br.pucminas.aluguel.dto.ContratoResponse;
import br.pucminas.aluguel.dto.CreditoRequest;
import br.pucminas.aluguel.exception.AcessoNegadoException;
import br.pucminas.aluguel.exception.RecursoNaoEncontradoException;
import br.pucminas.aluguel.exception.RegraNegocioException;
import br.pucminas.aluguel.model.Agente;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.model.Banco;
import br.pucminas.aluguel.model.Contrato;
import br.pucminas.aluguel.model.ContratoCredito;
import br.pucminas.aluguel.model.Pedido;
import br.pucminas.aluguel.model.StatusPedido;
import br.pucminas.aluguel.model.TipoProprietario;
import br.pucminas.aluguel.repository.AgenteRepository;
import br.pucminas.aluguel.repository.ContratoCreditoRepository;
import br.pucminas.aluguel.repository.ContratoRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import br.pucminas.aluguel.security.UsuarioLogado;

@Service
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final ContratoCreditoRepository creditoRepository;
    private final PedidoRepository pedidoRepository;
    private final AgenteRepository agenteRepository;

    public ContratoService(ContratoRepository contratoRepository, ContratoCreditoRepository creditoRepository,
            PedidoRepository pedidoRepository, AgenteRepository agenteRepository) {
        this.contratoRepository = contratoRepository;
        this.creditoRepository = creditoRepository;
        this.pedidoRepository = pedidoRepository;
        this.agenteRepository = agenteRepository;
    }

    @Transactional(readOnly = true)
    public List<ContratoResponse> listar(UsuarioLogado usuario) {
        List<Contrato> contratos = usuario.isCliente()
                ? contratoRepository.findByPedidoClienteIdOrderByIdDesc(usuario.id())
                : contratoRepository.findAllByOrderByIdDesc();
        return contratos.stream().map(ContratoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ContratoResponse buscar(Long id, UsuarioLogado usuario) {
        Contrato contrato = buscarContrato(id);
        if (usuario.isCliente() && !contrato.getPedido().getCliente().getId().equals(usuario.id())) {
            throw new AcessoNegadoException("Você só pode ver os seus próprios contratos");
        }
        return ContratoResponse.from(contrato);
    }

    // Executa o contrato de um pedido aprovado e registra quem fica como proprietário do carro.
    @Transactional
    public ContratoResponse executar(ContratoRequest dados, UsuarioLogado usuario) {
        Pedido pedido = pedidoRepository.findById(dados.pedidoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado"));
        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new RegraNegocioException("Só é possível executar contrato de pedidos aprovados");
        }
        if (contratoRepository.existsByPedidoId(pedido.getId())) {
            throw new RegraNegocioException("Esse pedido já tem contrato");
        }

        Agente agente = buscarAgente(usuario);
        TipoProprietario tipo = dados.tipoProprietario();
        if (tipo != TipoProprietario.CLIENTE && !tipo.name().equals(agente.getPerfil())) {
            throw new RegraNegocioException("O proprietário deve ser o cliente ou o próprio agente que assina o contrato");
        }

        Automovel automovel = pedido.getAutomovel();
        automovel.setTipoProprietario(tipo);
        automovel.setProprietario(tipo == TipoProprietario.CLIENTE ? pedido.getCliente() : agente);
        pedido.setStatus(StatusPedido.CONTRATADO);

        Contrato contrato = new Contrato();
        contrato.setPedido(pedido);
        contrato.setAgente(agente);
        contrato.setTipoProprietario(tipo);
        return ContratoResponse.from(contratoRepository.save(contrato));
    }

    // Só um banco concede crédito, e cada contrato pode ter no máximo um crédito.
    @Transactional
    public ContratoResponse concederCredito(Long contratoId, CreditoRequest dados, UsuarioLogado usuario) {
        Contrato contrato = buscarContrato(contratoId);
        if (!(buscarAgente(usuario) instanceof Banco banco)) {
            throw new AcessoNegadoException("Apenas bancos podem conceder crédito");
        }
        if (creditoRepository.existsByContratoId(contratoId)) {
            throw new RegraNegocioException("Esse contrato já tem um crédito concedido");
        }
        if (dados.valor() > contrato.getPedido().getValor()) {
            throw new RegraNegocioException("O crédito não pode ser maior que o valor do contrato");
        }

        ContratoCredito credito = new ContratoCredito();
        credito.setContrato(contrato);
        credito.setBanco(banco);
        credito.setValor(dados.valor());
        credito.setTaxaJuros(dados.taxaJuros());
        credito.setParcelas(dados.parcelas());
        contrato.setCredito(creditoRepository.save(credito));
        return ContratoResponse.from(contrato);
    }

    private Agente buscarAgente(UsuarioLogado usuario) {
        return agenteRepository.findById(usuario.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agente não encontrado"));
    }

    private Contrato buscarContrato(Long id) {
        return contratoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Contrato não encontrado"));
    }
}
