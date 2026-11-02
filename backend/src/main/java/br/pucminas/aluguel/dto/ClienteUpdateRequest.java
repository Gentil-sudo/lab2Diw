package br.pucminas.aluguel.dto;

import java.util.List;

import org.hibernate.validator.constraints.br.CPF;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClienteUpdateRequest(
        @NotBlank(message = "Informe o RG") String rg,
        @NotBlank(message = "Informe o CPF") @CPF(message = "CPF inválido") String cpf,
        @NotBlank(message = "Informe o nome") String nome,
        @NotNull(message = "Informe o endereço") @Valid EnderecoDto endereco,
        String profissao,
        @Size(max = 3, message = "Informe no máximo 3 rendimentos") List<@Valid RendimentoRequest> rendimentos) {
}
