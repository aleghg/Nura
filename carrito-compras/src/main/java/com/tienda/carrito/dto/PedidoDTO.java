package com.tienda.carrito.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public class PedidoDTO {

    @NotNull(message = "El total es obligatorio")
    @Positive(message = "El total debe ser mayor a 0")
    private BigDecimal total;

    // Solo para ADMIN: estado permitido en enum
    @Pattern(regexp = "PENDIENTE|PAGADO|CANCELADO|CERRADO",
            message = "Estado inválido. Valores permitidos: PENDIENTE, PAGADO, CANCELADO, CERRADO")


    private String estado;

    // Getters y Setters
    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
