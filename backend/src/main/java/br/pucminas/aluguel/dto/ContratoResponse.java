package br.pucminas.aluguel.dto;

import java.time.LocalDate;

import br.pucminas.aluguel.model.Contrato;

public record ContratoResponse(
        Long id,
        LocalDate dataAssinatura,
        String tipoProprietario,
        Long agenteId,
        String agenteNome,
        String agentePerfil,
        PedidoResponse pedido,
        CreditoResponse credito) {

    public static ContratoResponse from(Contrato c) {
        CreditoResponse credito = c.getCredito() != null ? CreditoResponse.from(c.getCredito()) : null;
        return new ContratoResponse(c.getId(), c.getDataAssinatura(), c.getTipoProprietario().name(),
                c.getAgente().getId(), c.getAgente().getNome(), c.getAgente().getPerfil(),
                PedidoResponse.from(c.getPedido()), credito);
    }
}
