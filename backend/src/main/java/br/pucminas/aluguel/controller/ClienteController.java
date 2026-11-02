package br.pucminas.aluguel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.pucminas.aluguel.dto.ClienteResponse;
import br.pucminas.aluguel.dto.ClienteUpdateRequest;
import br.pucminas.aluguel.security.UsuarioLogado;
import br.pucminas.aluguel.service.ClienteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('EMPRESA', 'BANCO')")
    public List<ClienteResponse> listar() {
        return clienteService.listar();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENTE')")
    public ClienteResponse meusDados(@AuthenticationPrincipal Jwt jwt) {
        UsuarioLogado usuario = UsuarioLogado.from(jwt);
        return clienteService.buscar(usuario.id(), usuario);
    }

    @GetMapping("/{id}")
    public ClienteResponse buscar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return clienteService.buscar(id, UsuarioLogado.from(jwt));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ClienteResponse atualizar(@PathVariable Long id, @RequestBody @Valid ClienteUpdateRequest dados,
            @AuthenticationPrincipal Jwt jwt) {
        return clienteService.atualizar(id, dados, UsuarioLogado.from(jwt));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        clienteService.excluir(id, UsuarioLogado.from(jwt));
    }
}
