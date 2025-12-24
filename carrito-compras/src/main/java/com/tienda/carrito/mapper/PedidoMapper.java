package com.tienda.carrito.mapper;

import com.tienda.carrito.dto.PedidoResponseDTO;
import com.tienda.carrito.model.Pedido;
import org.springframework.stereotype.Component;

@Component
public class PedidoMapper {

    public PedidoResponseDTO toDto(Pedido pedido) {
        if (pedido == null) return null;

        return new PedidoResponseDTO(
                pedido.getIdPedido(),
                pedido.getTotal(),
                pedido.getEstado().name(), // ✅ ESTO YA NO DA ERROR
                pedido.getFecha()
        );
    }
}
