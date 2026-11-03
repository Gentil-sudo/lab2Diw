package br.pucminas.aluguel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.pucminas.aluguel.dto.ContratoRequest;
import br.pucminas.aluguel.dto.ContratoResponse;
import br.pucminas.aluguel.dto.CreditoRequest;
import br.pucminas.aluguel.security.UsuarioLogado;
import br.pucminas.aluguel.service.ContratoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contratos")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @GetMapping
    public List<ContratoResponse> listar(@AuthenticationPrincipal Jwt jwt) {
        return contratoService.listar(UsuarioLogado.from(jwt));
    }

    @GetMapping("/{id}")
    public ContratoResponse buscar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return contratoService.buscar(id, UsuarioLogado.from(jwt));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPRESA', 'BANCO')")
    @ResponseStatus(HttpStatus.CREATED)
    public ContratoResponse executar(@RequestBody @Valid ContratoRequest dados, @AuthenticationPrincipal Jwt jwt) {
        return contratoService.executar(dados, UsuarioLogado.from(jwt));
    }

    @PostMapping("/{id}/credito")
    @PreAuthorize("hasRole('BANCO')")
    @ResponseStatus(HttpStatus.CREATED)
    public ContratoResponse concederCredito(@PathVariable Long id, @RequestBody @Valid CreditoRequest dados,
            @AuthenticationPrincipal Jwt jwt) {
        return contratoService.concederCredito(id, dados, UsuarioLogado.from(jwt));
    }
}
