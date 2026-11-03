package br.pucminas.aluguel.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record AutomovelRequest(
        @NotBlank(message = "Informe a matrícula") @Pattern(regexp = "\\d{11}", message = "A matrícula (RENAVAM) deve ter 11 dígitos") String matricula,
        @NotNull(message = "Informe o ano") @Min(value = 1950, message = "Ano inválido") @Max(value = 2100, message = "Ano inválido") Integer ano,
        @NotBlank(message = "Informe a marca") String marca,
        @NotBlank(message = "Informe o modelo") String modelo,
        @NotBlank(message = "Informe a placa") @Pattern(regexp = "[A-Za-z]{3}-?\\d[A-Za-z0-9]\\d{2}", message = "Placa inválida") String placa,
        @NotNull(message = "Informe o valor da diária") @Positive(message = "A diária deve ser maior que zero") Double valorDiaria) {
}
