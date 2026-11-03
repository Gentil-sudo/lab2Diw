package br.pucminas.aluguel.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AjustePedidoRequest(
        @NotNull(message = "Informe a data de início") LocalDate dataInicio,
        @NotNull(message = "Informe a data de devolução") LocalDate dataFim,
        @NotNull(message = "Informe o valor") @Positive(message = "O valor deve ser maior que zero") Double valor) {
}
