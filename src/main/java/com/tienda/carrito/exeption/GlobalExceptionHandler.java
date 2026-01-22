package com.tienda.carrito.exeption;


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

    // 🔴 VALIDACIONES DE FORMULARIO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarValidaciones(MethodArgumentNotValidException ex) {

        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errores.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest().body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 400,
                        "codigo", "VALIDACION",
                        "errores", errores
                )
        );
    }

    // 🔴 USUARIO NO AUTENTICADO
    @ExceptionHandler(UsuarioNoAutenticadoException.class)
    public ResponseEntity<?> usuarioNoAutenticado(UsuarioNoAutenticadoException ex) {
        return buildError(HttpStatus.UNAUTHORIZED, "NO_AUTENTICADO", ex.getMessage());
    }

    // 🔴 ACCESO DENEGADO
    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<?> accesoDenegado(AccesoDenegadoException ex) {
        return buildError(HttpStatus.FORBIDDEN, "ACCESO_DENEGADO", ex.getMessage());
    }

    // 🔴 STOCK
    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<?> stock(StockInsuficienteException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "STOCK", ex.getMessage());
    }

    // 🔴 ERRORES DE NEGOCIO CONTROLADOS
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> negocio(IllegalStateException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "NEGOCIO", ex.getMessage());
    }

    // 🧱 MÉTODO CENTRAL
    private ResponseEntity<?> buildError(HttpStatus status, String codigo, String mensaje) {
        return ResponseEntity.status(status).body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", status.value(),
                        "codigo", codigo,
                        "mensaje", mensaje
                )
        );
    }
}
