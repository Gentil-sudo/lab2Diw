package br.pucminas.aluguel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.pucminas.aluguel.model.Pedido;
import br.pucminas.aluguel.model.StatusPedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteIdOrderByDataCriacaoDesc(Long clienteId);

    List<Pedido> findByStatusOrderByDataCriacaoDesc(StatusPedido status);

    List<Pedido> findAllByOrderByDataCriacaoDesc();

    boolean existsByAutomovelId(Long automovelId);

    boolean existsByClienteId(Long clienteId);

    // Dois períodos se cruzam quando um começa antes do outro terminar.
    @Query("""
            select count(p) > 0 from Pedido p
            where p.automovel.id = :automovelId
              and p.id <> :ignorarPedidoId
              and p.status in :statusAtivos
              and p.dataInicio < :fim
              and p.dataFim > :inicio
            """)
    boolean existeReservaNoPeriodo(@Param("automovelId") Long automovelId,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            @Param("statusAtivos") List<StatusPedido> statusAtivos,
            @Param("ignorarPedidoId") Long ignorarPedidoId);
}
