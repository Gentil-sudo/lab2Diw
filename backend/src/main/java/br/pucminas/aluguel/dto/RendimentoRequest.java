package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.Rendimento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record RendimentoRequest(
        @NotBlank(message = "Informe a entidade empregadora") String entidadeEmpregadora,
        @Positive(message = "O rendimento deve ser maior que zero") double valor) {

    public Rendimento toEntity() {
        return new Rendimento(entidadeEmpregadora, valor);
    }
}
