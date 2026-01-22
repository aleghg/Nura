package com.tienda.carrito.dto;

import java.math.BigDecimal;
import java.util.Date;

public record PedidoResponseDTO(
        Long id,
        BigDecimal total,
        String estado,
        Date fecha
) {
}
