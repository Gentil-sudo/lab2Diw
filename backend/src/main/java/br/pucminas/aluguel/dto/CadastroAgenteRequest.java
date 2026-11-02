package br.pucminas.aluguel.dto;

import org.hibernate.validator.constraints.br.CNPJ;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CadastroAgenteRequest(
        @NotBlank(message = "Informe o login") String login,
        @NotBlank(message = "Informe a senha") @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres") String senha,
        @NotBlank(message = "Informe o nome") String nome,
        @NotBlank(message = "Informe o CNPJ") @CNPJ(message = "CNPJ inválido") String cnpj,
        @NotNull(message = "Informe o tipo (EMPRESA ou BANCO)") TipoAgente tipo) {

    public enum TipoAgente {
        EMPRESA,
        BANCO
    }
}
