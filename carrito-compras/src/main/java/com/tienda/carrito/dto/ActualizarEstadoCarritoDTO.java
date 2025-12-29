package com.tienda.carrito.dto;

import com.tienda.carrito.enums.EstadoCarrito;
import jakarta.validation.constraints.NotNull;


//ADMIN
public class ActualizarEstadoCarritoDTO {

    @NotNull(message = "El estado es obligatorio")
    private EstadoCarrito estado;

    public EstadoCarrito getEstado() {
        return estado;
    }

    public void setEstado(EstadoCarrito estado) {
        this.estado = estado;
    }
}
