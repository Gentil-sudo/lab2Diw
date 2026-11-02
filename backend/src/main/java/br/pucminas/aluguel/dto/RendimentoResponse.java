package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.Rendimento;

public record RendimentoResponse(Long id, String entidadeEmpregadora, double valor) {

    public static RendimentoResponse from(Rendimento r) {
        return new RendimentoResponse(r.getId(), r.getEntidadeEmpregadora(), r.getValor());
    }
}
