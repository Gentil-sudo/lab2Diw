package br.pucminas.aluguel.dto;

import java.util.List;

import org.hibernate.validator.constraints.br.CPF;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroClienteRequest(
        @NotBlank(message = "Informe o login") String login,
        @NotBlank(message = "Informe a senha") @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres") String senha,
        @NotBlank(message = "Informe o RG") String rg,
        @NotBlank(message = "Informe o CPF") @CPF(message = "CPF inválido") String cpf,
        @NotBlank(message = "Informe o nome") String nome,
        @NotBlank(message = "Informe o endereço") String endereco,
        String profissao,
        @Size(max = 3, message = "Informe no máximo 3 rendimentos") List<@Valid RendimentoRequest> rendimentos) {
}
