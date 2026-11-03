package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.TipoProprietario;
import jakarta.validation.constraints.NotNull;

public record ContratoRequest(
        @NotNull(message = "Informe o pedido") Long pedidoId,
        @NotNull(message = "Informe quem fica como proprietário do carro") TipoProprietario tipoProprietario) {
}
