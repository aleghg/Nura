package com.tienda.carrito.dto;

import jakarta.validation.constraints.NotBlank;

public class CrearPedidoDTO {

    @NotBlank
    private String direccionEnvio;

    @NotBlank
    private String metodoPago;

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
