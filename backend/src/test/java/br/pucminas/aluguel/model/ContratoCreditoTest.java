package br.pucminas.aluguel.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ContratoCreditoTest {

    private ContratoCredito credito(double valor, double taxa, int parcelas) {
        ContratoCredito credito = new ContratoCredito();
        credito.setValor(valor);
        credito.setTaxaJuros(taxa);
        credito.setParcelas(parcelas);
        return credito;
    }

    @Test
    void calculaParcelaComJuros() {
        assertEquals(52.66, credito(300, 1.5, 6).calcularParcela(), 0.01);
    }

    @Test
    void calculaParcelaSemJuros() {
        assertEquals(50.0, credito(200, 0, 4).calcularParcela(), 0.001);
    }

    @Test
    void parcelaUnicaComJurosCobraUmMes() {
        assertEquals(1020.0, credito(1000, 2, 1).calcularParcela(), 0.001);
    }
}
