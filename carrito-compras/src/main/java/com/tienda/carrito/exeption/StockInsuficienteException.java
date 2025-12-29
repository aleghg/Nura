package com.tienda.carrito.exeption;

public class StockInsuficienteException extends RuntimeException {
    public StockInsuficienteException(String msg) {
        super(msg);
    }
}
