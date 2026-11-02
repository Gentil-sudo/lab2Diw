package br.pucminas.aluguel.dto;

public record LoginResponse(String token, Long id, String nome, String perfil) {
}
