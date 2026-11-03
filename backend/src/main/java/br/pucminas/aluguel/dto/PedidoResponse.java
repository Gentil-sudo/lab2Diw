package br.pucminas.aluguel.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import br.pucminas.aluguel.model.Pedido;

public record PedidoResponse(
        Long id,
        String status,
        LocalDate dataInicio,
        LocalDate dataFim,
        long dias,
        double valor,
        LocalDateTime dataCriacao,
        String parecer,
        LocalDateTime dataAvaliacao,
        Long clienteId,
        String clienteNome,
        String agenteNome,
        AutomovelResponse automovel) {

    public static PedidoResponse from(Pedido p) {
        String agente = p.getAgenteAvaliador() != null ? p.getAgenteAvaliador().getNome() : null;
        return new PedidoResponse(p.getId(), p.getStatus().name(), p.getDataInicio(), p.getDataFim(),
                ChronoUnit.DAYS.between(p.getDataInicio(), p.getDataFim()), p.getValor(), p.getDataCriacao(),
                p.getParecer(), p.getDataAvaliacao(), p.getCliente().getId(), p.getCliente().getNome(), agente,
                AutomovelResponse.from(p.getAutomovel()));
    }
}
