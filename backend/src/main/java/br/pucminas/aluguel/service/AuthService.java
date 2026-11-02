package br.pucminas.aluguel.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucminas.aluguel.dto.AgenteResponse;
import br.pucminas.aluguel.dto.CadastroAgenteRequest;
import br.pucminas.aluguel.dto.CadastroClienteRequest;
import br.pucminas.aluguel.dto.ClienteResponse;
import br.pucminas.aluguel.dto.LoginRequest;
import br.pucminas.aluguel.dto.LoginResponse;
import br.pucminas.aluguel.dto.RendimentoRequest;
import br.pucminas.aluguel.exception.CredenciaisInvalidasException;
import br.pucminas.aluguel.exception.RegraNegocioException;
import br.pucminas.aluguel.model.Agente;
import br.pucminas.aluguel.model.Banco;
import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Empresa;
import br.pucminas.aluguel.model.Usuario;
import br.pucminas.aluguel.repository.AgenteRepository;
import br.pucminas.aluguel.repository.ClienteRepository;
import br.pucminas.aluguel.repository.UsuarioRepository;
import br.pucminas.aluguel.security.TokenService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository,
            AgenteRepository agenteRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public ClienteResponse cadastrarCliente(CadastroClienteRequest dados) {
        String cpf = somenteNumeros(dados.cpf());
        validarLoginDisponivel(dados.login());
        if (clienteRepository.existsByCpf(cpf)) {
            throw new RegraNegocioException("Já existe um cliente com esse CPF");
        }

        Cliente cliente = new Cliente();
        cliente.setLogin(dados.login());
        cliente.setSenha(passwordEncoder.encode(dados.senha()));
        cliente.setRg(dados.rg());
        cliente.setCpf(cpf);
        cliente.setNome(dados.nome());
        cliente.setEndereco(dados.endereco());
        cliente.setProfissao(dados.profissao());
        if (dados.rendimentos() != null) {
            for (RendimentoRequest r : dados.rendimentos()) {
                cliente.adicionarRendimento(r.toEntity());
            }
        }

        return ClienteResponse.from(clienteRepository.save(cliente));
    }

    // O agente pode ser empresa ou banco. O tipo escolhido no cadastro decide
    // qual classe é criada, e isso define o que ele vai poder fazer no sistema.
    @Transactional
    public AgenteResponse cadastrarAgente(CadastroAgenteRequest dados) {
        String cnpj = somenteNumeros(dados.cnpj());
        validarLoginDisponivel(dados.login());
        if (agenteRepository.existsByCnpj(cnpj)) {
            throw new RegraNegocioException("Já existe um agente com esse CNPJ");
        }

        Agente agente = dados.tipo() == CadastroAgenteRequest.TipoAgente.BANCO ? new Banco() : new Empresa();
        agente.setLogin(dados.login());
        agente.setSenha(passwordEncoder.encode(dados.senha()));
        agente.setNome(dados.nome());
        agente.setCnpj(cnpj);

        return AgenteResponse.from(agenteRepository.save(agente));
    }

    // Confere login e senha. A senha do banco está criptografada, então o
    // matches() criptografa a senha digitada e compara as duas. A mensagem de erro
    // é sempre a mesma pra não entregar se o que errou foi o login ou a senha.
    public LoginResponse login(LoginRequest dados) {
        Usuario usuario = usuarioRepository.findByLogin(dados.login())
                .orElseThrow(CredenciaisInvalidasException::new);

        if (!passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            throw new CredenciaisInvalidasException();
        }

        String nome = usuario instanceof Cliente c ? c.getNome() : ((Agente) usuario).getNome();
        return new LoginResponse(tokenService.gerarToken(usuario), usuario.getId(), nome, usuario.getPerfil());
    }

    private void validarLoginDisponivel(String login) {
        if (usuarioRepository.existsByLogin(login)) {
            throw new RegraNegocioException("Esse login já está em uso");
        }
    }

    private String somenteNumeros(String texto) {
        return texto.replaceAll("\\D", "");
    }
}
