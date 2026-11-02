package br.pucminas.aluguel.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Essa classe "escuta" os erros de todos os controllers. Assim o front-end
// sempre recebe um JSON no mesmo formato, em vez de uma página de erro do Spring.
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(RecursoNaoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErroResponse(404, e.getMessage()));
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<ErroResponse> credenciaisInvalidas(CredenciaisInvalidasException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErroResponse(401, e.getMessage()));
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ResponseEntity<ErroResponse> acessoNegado(AcessoNegadoException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErroResponse(403, e.getMessage()));
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResponse> regraNegocio(RegraNegocioException e) {
        return ResponseEntity.badRequest()
                .body(new ErroResponse(400, e.getMessage()));
    }

    // Quando o @Valid encontra campos inválidos, junta todos os erros num mapa
    // (campo -> mensagem) pra tela conseguir mostrar o erro embaixo de cada campo.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException e) {
        Map<String, String> campos = new HashMap<>();
        for (FieldError erro : e.getBindingResult().getFieldErrors()) {
            campos.put(erro.getField(), erro.getDefaultMessage());
        }
        return ResponseEntity.badRequest()
                .body(new ErroResponse(400, "Dados inválidos", campos, LocalDateTime.now()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponse> jsonInvalido(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest()
                .body(new ErroResponse(400, "JSON inválido ou campo com formato errado"));
    }
}
