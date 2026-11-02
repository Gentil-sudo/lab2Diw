package br.pucminas.aluguel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.pucminas.aluguel.dto.AutomovelRequest;
import br.pucminas.aluguel.dto.AutomovelResponse;
import br.pucminas.aluguel.security.UsuarioLogado;
import br.pucminas.aluguel.service.AutomovelService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @GetMapping
    public List<AutomovelResponse> listar() {
        return automovelService.listar();
    }

    @GetMapping("/{id}")
    public AutomovelResponse buscar(@PathVariable Long id) {
        return automovelService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPRESA', 'BANCO')")
    @ResponseStatus(HttpStatus.CREATED)
    public AutomovelResponse criar(@RequestBody @Valid AutomovelRequest dados, @AuthenticationPrincipal Jwt jwt) {
        return automovelService.criar(dados, UsuarioLogado.from(jwt));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPRESA', 'BANCO')")
    public AutomovelResponse atualizar(@PathVariable Long id, @RequestBody @Valid AutomovelRequest dados,
            @AuthenticationPrincipal Jwt jwt) {
        return automovelService.atualizar(id, dados, UsuarioLogado.from(jwt));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPRESA', 'BANCO')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        automovelService.excluir(id, UsuarioLogado.from(jwt));
    }
}
