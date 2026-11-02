package br.pucminas.aluguel.service;

import java.time.Year;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucminas.aluguel.dto.AutomovelRequest;
import br.pucminas.aluguel.dto.AutomovelResponse;
import br.pucminas.aluguel.exception.AcessoNegadoException;
import br.pucminas.aluguel.exception.RecursoNaoEncontradoException;
import br.pucminas.aluguel.exception.RegraNegocioException;
import br.pucminas.aluguel.model.Agente;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.model.TipoProprietario;
import br.pucminas.aluguel.repository.AgenteRepository;
import br.pucminas.aluguel.repository.AutomovelRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import br.pucminas.aluguel.security.UsuarioLogado;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;
    private final PedidoRepository pedidoRepository;

    public AutomovelService(AutomovelRepository automovelRepository, AgenteRepository agenteRepository,
            PedidoRepository pedidoRepository) {
        this.automovelRepository = automovelRepository;
        this.agenteRepository = agenteRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listar() {
        return automovelRepository.findAll().stream()
                .map(AutomovelResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AutomovelResponse buscar(Long id) {
        return AutomovelResponse.from(buscarAutomovel(id));
    }

    // O carro nasce como propriedade do agente que cadastrou (empresa ou banco).
    @Transactional
    public AutomovelResponse criar(AutomovelRequest dados, UsuarioLogado usuario) {
        Agente agente = agenteRepository.findById(usuario.id())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agente não encontrado"));

        Automovel automovel = new Automovel();
        preencher(automovel, dados);
        automovel.setProprietario(agente);
        automovel.setTipoProprietario(TipoProprietario.valueOf(agente.getPerfil()));

        return AutomovelResponse.from(automovelRepository.save(automovel));
    }

    @Transactional
    public AutomovelResponse atualizar(Long id, AutomovelRequest dados, UsuarioLogado usuario) {
        Automovel automovel = buscarAutomovel(id);
        validarDono(automovel, usuario);
        preencher(automovel, dados);
        return AutomovelResponse.from(automovelRepository.save(automovel));
    }

    @Transactional
    public void excluir(Long id, UsuarioLogado usuario) {
        Automovel automovel = buscarAutomovel(id);
        validarDono(automovel, usuario);
        if (pedidoRepository.existsByAutomovelId(id)) {
            throw new RegraNegocioException("Não é possível remover um automóvel que já tem pedidos");
        }
        automovelRepository.delete(automovel);
    }

    private void preencher(Automovel automovel, AutomovelRequest dados) {
        String placa = dados.placa().replace("-", "").toUpperCase();
        int anoMaximo = Year.now().getValue() + 1;

        if (dados.ano() > anoMaximo) {
            throw new RegraNegocioException("O ano não pode ser maior que " + anoMaximo);
        }
        if (!dados.matricula().equals(automovel.getMatricula()) && automovelRepository.existsByMatricula(dados.matricula())) {
            throw new RegraNegocioException("Já existe um automóvel com essa matrícula");
        }
        if (!placa.equals(automovel.getPlaca()) && automovelRepository.existsByPlaca(placa)) {
            throw new RegraNegocioException("Já existe um automóvel com essa placa");
        }

        automovel.setMatricula(dados.matricula());
        automovel.setAno(dados.ano());
        automovel.setMarca(dados.marca());
        automovel.setModelo(dados.modelo());
        automovel.setPlaca(placa);
    }

    private Automovel buscarAutomovel(Long id) {
        return automovelRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Automóvel não encontrado"));
    }

    private void validarDono(Automovel automovel, UsuarioLogado usuario) {
        if (automovel.getProprietario() == null || !automovel.getProprietario().getId().equals(usuario.id())) {
            throw new AcessoNegadoException("Só o agente dono do automóvel pode alterá-lo");
        }
    }
}
