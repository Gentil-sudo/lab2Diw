package br.pucminas.aluguel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.pucminas.aluguel.dto.AjustePedidoRequest;
import br.pucminas.aluguel.dto.AvaliacaoRequest;
import br.pucminas.aluguel.dto.PedidoRequest;
import br.pucminas.aluguel.dto.PedidoResponse;
import br.pucminas.aluguel.model.StatusPedido;
import br.pucminas.aluguel.security.UsuarioLogado;
import br.pucminas.aluguel.service.PedidoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<PedidoResponse> listar(@RequestParam(required = false) StatusPedido status,
            @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.listar(UsuarioLogado.from(jwt), status);
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.buscar(id, UsuarioLogado.from(jwt));
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(@RequestBody @Valid PedidoRequest dados, @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.criar(dados, UsuarioLogado.from(jwt));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public PedidoResponse modificar(@PathVariable Long id, @RequestBody @Valid PedidoRequest dados,
            @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.modificar(id, dados, UsuarioLogado.from(jwt));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('CLIENTE')")
    public PedidoResponse cancelar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.cancelar(id, UsuarioLogado.from(jwt));
    }

    @PatchMapping("/{id}/ajustar")
    @PreAuthorize("hasAnyRole('EMPRESA', 'BANCO')")
    public PedidoResponse ajustar(@PathVariable Long id, @RequestBody @Valid AjustePedidoRequest dados) {
        return pedidoService.ajustar(id, dados);
    }

    @PatchMapping("/{id}/avaliar")
    @PreAuthorize("hasAnyRole('EMPRESA', 'BANCO')")
    public PedidoResponse avaliar(@PathVariable Long id, @RequestBody @Valid AvaliacaoRequest dados,
            @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.avaliar(id, dados, UsuarioLogado.from(jwt));
    }
}
