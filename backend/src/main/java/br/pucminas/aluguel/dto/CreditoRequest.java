package br.pucminas.aluguel.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CreditoRequest(
        @NotNull(message = "Informe o valor") @Positive(message = "O valor deve ser maior que zero") Double valor,
        @NotNull(message = "Informe a taxa de juros") @PositiveOrZero(message = "A taxa não pode ser negativa")
        @DecimalMax(value = "20.0", message = "A taxa pode ser no máximo 20% ao mês") Double taxaJuros,
        @NotNull(message = "Informe as parcelas") @Min(value = 1, message = "Mínimo de 1 parcela")
        @Max(value = 72, message = "Máximo de 72 parcelas") Integer parcelas) {
}
