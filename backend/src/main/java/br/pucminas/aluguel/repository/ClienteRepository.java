package br.pucminas.aluguel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByCpf(String cpf);
}
