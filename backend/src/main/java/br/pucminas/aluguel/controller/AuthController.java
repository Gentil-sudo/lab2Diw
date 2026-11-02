package br.pucminas.aluguel.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.pucminas.aluguel.dto.AgenteResponse;
import br.pucminas.aluguel.dto.CadastroAgenteRequest;
import br.pucminas.aluguel.dto.CadastroClienteRequest;
import br.pucminas.aluguel.dto.ClienteResponse;
import br.pucminas.aluguel.dto.LoginRequest;
import br.pucminas.aluguel.dto.LoginResponse;
import br.pucminas.aluguel.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro/cliente")
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteResponse cadastrarCliente(@RequestBody @Valid CadastroClienteRequest dados) {
        return authService.cadastrarCliente(dados);
    }

    @PostMapping("/cadastro/agente")
    @ResponseStatus(HttpStatus.CREATED)
    public AgenteResponse cadastrarAgente(@RequestBody @Valid CadastroAgenteRequest dados) {
        return authService.cadastrarAgente(dados);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest dados) {
        return authService.login(dados);
    }
}
