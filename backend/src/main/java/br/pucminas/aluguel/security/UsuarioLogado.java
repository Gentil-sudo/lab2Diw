package br.pucminas.aluguel.security;

import org.springframework.security.oauth2.jwt.Jwt;

public record UsuarioLogado(Long id, String perfil) {

    public static UsuarioLogado from(Jwt jwt) {
        return new UsuarioLogado(Long.valueOf(jwt.getSubject()), jwt.getClaimAsString("perfil"));
    }

    public boolean isCliente() {
        return "CLIENTE".equals(perfil);
    }

    public boolean isAgente() {
        return "EMPRESA".equals(perfil) || "BANCO".equals(perfil);
    }
}
