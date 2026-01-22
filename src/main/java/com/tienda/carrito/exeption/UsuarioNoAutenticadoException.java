package com.tienda.carrito.exeption;

public class UsuarioNoAutenticadoException extends RuntimeException {
    public UsuarioNoAutenticadoException(String mensaje) {
        super(mensaje);
    }
}
