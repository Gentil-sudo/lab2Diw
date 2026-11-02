package br.pucminas.aluguel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.Agente;

public interface AgenteRepository extends JpaRepository<Agente, Long> {

    boolean existsByCnpj(String cnpj);
}
