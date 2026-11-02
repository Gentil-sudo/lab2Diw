package br.pucminas.aluguel.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucminas.aluguel.dto.ClienteResponse;
import br.pucminas.aluguel.dto.ClienteUpdateRequest;
import br.pucminas.aluguel.dto.RendimentoRequest;
import br.pucminas.aluguel.exception.AcessoNegadoException;
import br.pucminas.aluguel.exception.RecursoNaoEncontradoException;
import br.pucminas.aluguel.exception.RegraNegocioException;
import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.repository.ClienteRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import br.pucminas.aluguel.security.UsuarioLogado;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PedidoRepository pedidoRepository;

    public ClienteService(ClienteRepository clienteRepository, PedidoRepository pedidoRepository) {
        this.clienteRepository = clienteRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return clienteRepository.findAll().stream()
                .map(ClienteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscar(Long id, UsuarioLogado usuario) {
        validarAcesso(id, usuario);
        return ClienteResponse.from(buscarCliente(id));
    }

    // Os rendimentos são substituídos todos de uma vez pelos que vieram da tela.
    @Transactional
    public ClienteResponse atualizar(Long id, ClienteUpdateRequest dados, UsuarioLogado usuario) {
        validarDono(id, usuario);
        Cliente cliente = buscarCliente(id);

        String cpf = dados.cpf().replaceAll("\\D", "");
        if (!cpf.equals(cliente.getCpf()) && clienteRepository.existsByCpf(cpf)) {
            throw new RegraNegocioException("Já existe um cliente com esse CPF");
        }

        cliente.setRg(dados.rg());
        cliente.setCpf(cpf);
        cliente.setNome(dados.nome());
        cliente.setEndereco(dados.endereco().toEntity());
        cliente.setProfissao(dados.profissao());

        cliente.limparRendimentos();
        if (dados.rendimentos() != null) {
            for (RendimentoRequest r : dados.rendimentos()) {
                cliente.adicionarRendimento(r.toEntity());
            }
        }

        return ClienteResponse.from(clienteRepository.save(cliente));
    }

    @Transactional
    public void excluir(Long id, UsuarioLogado usuario) {
        validarDono(id, usuario);
        Cliente cliente = buscarCliente(id);

        if (pedidoRepository.existsByClienteId(id)) {
            throw new RegraNegocioException("Não é possível excluir um cliente que já fez pedidos");
        }
        clienteRepository.delete(cliente);
    }

    private Cliente buscarCliente(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado"));
    }

    private void validarAcesso(Long id, UsuarioLogado usuario) {
        if (usuario.isCliente() && !usuario.id().equals(id)) {
            throw new AcessoNegadoException("Você só pode acessar os seus próprios dados");
        }
    }

    private void validarDono(Long id, UsuarioLogado usuario) {
        if (!usuario.isCliente() || !usuario.id().equals(id)) {
            throw new AcessoNegadoException("Só o próprio cliente pode alterar ou excluir o cadastro");
        }
    }
}
