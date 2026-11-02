package br.pucminas.aluguel.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErroResponse(int status, String mensagem, Map<String, String> campos, LocalDateTime data) {

    public ErroResponse(int status, String mensagem) {
        this(status, mensagem, null, LocalDateTime.now());
    }
}
