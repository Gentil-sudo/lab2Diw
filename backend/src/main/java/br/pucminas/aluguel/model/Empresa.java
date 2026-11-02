package br.pucminas.aluguel.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "empresas")
public class Empresa extends Agente {

    @Override
    public String getPerfil() {
        return "EMPRESA";
    }
}
