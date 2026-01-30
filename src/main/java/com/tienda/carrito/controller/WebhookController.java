package com.tienda.carrito.controller;

import com.tienda.carrito.enums.EstadoPedido;
import com.tienda.carrito.model.Pedido;
import com.tienda.carrito.repository.PedidoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/webhooks/mp")
public class WebhookController {

    private final PedidoRepository pedidoRepository;

    public WebhookController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @PostMapping
    public void recibir(@RequestBody Map<String, Object> payload) {
        System.out.println("Webhook recibido: " + payload);
        // En producción: validar firma y actualizar pedido
    }
}
