package com.tienda.carrito.exception;

import com.tienda.carrito.exeption.AccesoDenegadoException;
import com.tienda.carrito.exeption.StockInsuficienteException;
import com.tienda.carrito.exeption.UsuarioNoAutenticadoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsuarioNoAutenticadoException.class)
    public ResponseEntity<?> usuarioNoAutenticado(UsuarioNoAutenticadoException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                error("NO_AUTENTICADO", ex.getMessage())
        );
    }

    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<?> accesoDenegado(AccesoDenegadoException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                error("ACCESO_DENEGADO", ex.getMessage())
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> runtime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                error("ERROR_NEGOCIO", ex.getMessage())
        );
    }

    private Map<String, Object> error(String codigo, String mensaje) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "codigo", codigo,
                "mensaje", mensaje
        );
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<?> stock(StockInsuficienteException ex) {
        return ResponseEntity.badRequest().body(
                error("STOCK", ex.getMessage())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarValidaciones(MethodArgumentNotValidException ex) {

        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error ->
                        errores.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errores);
    }

}
