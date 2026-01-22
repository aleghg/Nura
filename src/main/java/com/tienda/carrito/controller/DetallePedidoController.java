package com.tienda.carrito.controller;

import com.tienda.carrito.dto.DetallePedidoDTO;
import com.tienda.carrito.model.DetallePedido;
import com.tienda.carrito.service.DetallePedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalles")
@PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService service;

    @PostMapping
    public DetallePedido crear(@RequestBody DetallePedidoDTO dto) {
        return service.crearDetalleDesdeDTO(dto);
    }

    @GetMapping
    public List<DetallePedido> listar() {
        return service.listar();
    }

    @GetMapping("/pedido/{id}")
    public List<DetallePedido> listarPorPedido(@PathVariable Long id) {
        return service.listarPorPedido(id);
    }
}
