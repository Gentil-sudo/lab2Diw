package br.pucminas.aluguel.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "bancos")
public class Banco extends Agente {

    @Override
    public String getPerfil() {
        return "BANCO";
    }
}
