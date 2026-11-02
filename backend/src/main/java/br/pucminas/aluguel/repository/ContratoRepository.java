package br.pucminas.aluguel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.Contrato;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    Optional<Contrato> findByPedidoId(Long pedidoId);

    List<Contrato> findByPedidoClienteId(Long clienteId);

    List<Contrato> findByAgenteId(Long agenteId);
}
