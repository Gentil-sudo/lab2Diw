package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.ContratoCredito;

public record CreditoResponse(
        Long id,
        String bancoNome,
        double valor,
        double taxaJuros,
        int parcelas,
        double valorParcela,
        double valorTotal) {

    public static CreditoResponse from(ContratoCredito c) {
        double parcela = c.calcularParcela();
        return new CreditoResponse(c.getId(), c.getBanco().getNome(), c.getValor(), c.getTaxaJuros(),
                c.getParcelas(), parcela, parcela * c.getParcelas());
    }
}
