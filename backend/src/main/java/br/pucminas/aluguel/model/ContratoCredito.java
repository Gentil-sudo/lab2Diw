package br.pucminas.aluguel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "contrato_id", unique = true)
    private Contrato contrato;

    @ManyToOne(optional = false)
    @JoinColumn(name = "banco_id")
    private Banco banco;

    @Column(nullable = false)
    private double valor;

    @Column(nullable = false)
    private double taxaJuros;

    @Column(nullable = false)
    private int parcelas;

    public Long getId() {
        return id;
    }

    public Contrato getContrato() {
        return contrato;
    }

    public void setContrato(Contrato contrato) {
        this.contrato = contrato;
    }

    public Banco getBanco() {
        return banco;
    }

    public void setBanco(Banco banco) {
        this.banco = banco;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public double getTaxaJuros() {
        return taxaJuros;
    }

    public void setTaxaJuros(double taxaJuros) {
        this.taxaJuros = taxaJuros;
    }

    public int getParcelas() {
        return parcelas;
    }

    public void setParcelas(int parcelas) {
        this.parcelas = parcelas;
    }

    // Tabela Price: parcela fixa com juros compostos ao mês.
    public double calcularParcela() {
        double taxa = taxaJuros / 100;
        if (taxa == 0) {
            return valor / parcelas;
        }
        return valor * taxa / (1 - Math.pow(1 + taxa, -parcelas));
    }
}
