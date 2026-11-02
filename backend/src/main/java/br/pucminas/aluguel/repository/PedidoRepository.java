package br.pucminas.aluguel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucminas.aluguel.model.Pedido;
import br.pucminas.aluguel.model.StatusPedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteIdOrderByDataCriacaoDesc(Long clienteId);

    List<Pedido> findByStatusOrderByDataCriacaoDesc(StatusPedido status);

    List<Pedido> findAllByOrderByDataCriacaoDesc();

    boolean existsByAutomovelId(Long automovelId);

    boolean existsByClienteId(Long clienteId);
}
