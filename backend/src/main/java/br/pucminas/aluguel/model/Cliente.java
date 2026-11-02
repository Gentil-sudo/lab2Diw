package br.pucminas.aluguel.model;

import java.util.ArrayList;
import java.util.List;

import br.pucminas.aluguel.exception.RegraNegocioException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {

    public static final int MAX_RENDIMENTOS = 3;

    @Column(nullable = false)
    private String rg;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    private String profissao;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rendimento> rendimentos = new ArrayList<>();

    @Override
    public String getPerfil() {
        return "CLIENTE";
    }

    // O enunciado pede no máximo 3 rendimentos por cliente, então a regra fica aqui
    // pra ninguém conseguir passar desse limite. Também já liga o rendimento ao
    // cliente, senão o JPA salva o rendimento sem dono.
    public void adicionarRendimento(Rendimento rendimento) {
        if (rendimentos.size() >= MAX_RENDIMENTOS) {
            throw new RegraNegocioException("O cliente pode ter no máximo " + MAX_RENDIMENTOS + " rendimentos");
        }
        rendimento.setCliente(this);
        rendimentos.add(rendimento);
    }

    // Usado na edição do cliente: apaga os rendimentos antigos antes de colocar os novos.
    public void limparRendimentos() {
        rendimentos.clear();
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public List<Rendimento> getRendimentos() {
        return rendimentos;
    }
}
