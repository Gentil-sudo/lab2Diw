package br.pucminas.aluguel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.ContratoCredito;

public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {

    Optional<ContratoCredito> findByContratoId(Long contratoId);

    List<ContratoCredito> findByBancoId(Long bancoId);
}
