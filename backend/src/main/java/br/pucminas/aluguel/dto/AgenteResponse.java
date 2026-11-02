package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.Agente;

public record AgenteResponse(Long id, String login, String nome, String cnpj, String tipo) {

    public static AgenteResponse from(Agente a) {
        return new AgenteResponse(a.getId(), a.getLogin(), a.getNome(), a.getCnpj(), a.getPerfil());
    }
}
