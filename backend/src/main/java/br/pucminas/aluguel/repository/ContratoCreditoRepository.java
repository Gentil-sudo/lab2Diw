package br.pucminas.aluguel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.ContratoCredito;

public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {

    boolean existsByContratoId(Long contratoId);
}
