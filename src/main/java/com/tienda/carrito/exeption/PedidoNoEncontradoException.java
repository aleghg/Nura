package com.tienda.carrito.exeption;

public class PedidoNoEncontradoException extends RuntimeException {
    public PedidoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}