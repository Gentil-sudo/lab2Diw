package br.pucminas.aluguel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.Contrato;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    List<Contrato> findByPedidoClienteIdOrderByIdDesc(Long clienteId);

    List<Contrato> findAllByOrderByIdDesc();

    boolean existsByPedidoId(Long pedidoId);
}
