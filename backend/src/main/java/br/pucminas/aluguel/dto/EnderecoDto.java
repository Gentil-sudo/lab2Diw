package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.Endereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoDto(
        @NotBlank(message = "Informe o CEP") @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido") String cep,
        @NotBlank(message = "Informe a rua") String logradouro,
        @NotBlank(message = "Informe o número") @Size(max = 10, message = "Número muito longo") String numero,
        String complemento,
        @NotBlank(message = "Informe o bairro") String bairro,
        @NotBlank(message = "Informe a cidade") String cidade,
        @NotBlank(message = "Informe a UF") @Pattern(regexp = "[A-Za-z]{2}", message = "UF inválida") String uf) {

    public Endereco toEntity() {
        Endereco e = new Endereco();
        e.setCep(cep.replaceAll("\\D", ""));
        e.setLogradouro(logradouro);
        e.setNumero(numero);
        e.setComplemento(complemento);
        e.setBairro(bairro);
        e.setCidade(cidade);
        e.setUf(uf.toUpperCase());
        return e;
    }

    public static EnderecoDto from(Endereco e) {
        if (e == null) {
            return null;
        }
        return new EnderecoDto(e.getCep(), e.getLogradouro(), e.getNumero(), e.getComplemento(),
                e.getBairro(), e.getCidade(), e.getUf());
    }
}
