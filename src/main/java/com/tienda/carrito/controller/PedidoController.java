package com.tienda.carrito.controller;

import com.tienda.carrito.dto.CrearPedidoDTO;
import com.tienda.carrito.dto.PedidoDTO;
import com.tienda.carrito.dto.PedidoResponseDTO;
import com.tienda.carrito.mapper.PedidoMapper;
import com.tienda.carrito.model.Pedido;
import com.tienda.carrito.service.PedidoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService service;
    private final PedidoMapper mapper;

    public PedidoController(PedidoService service, PedidoMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping("/crear")
    @PreAuthorize("hasRole('CLIENTE')")
    public Pedido crearPedido(@RequestBody CrearPedidoDTO dto) {
        return service.confirmarPedidoDesdeCarrito(dto);
    }

    // CLIENTE Ver MIS pedidos
    @GetMapping("/mios")
    @PreAuthorize("hasRole('CLIENTE')")
    public Page<Pedido> listarMisPedidos(Pageable pageable) {
        return service.listarMisPedidos(pageable);
    }


    // =========================
    // 🛒 CLIENTE → MI PEDIDO POR ID
    // =========================
    @GetMapping("/mios/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    public Pedido verMiPedido(@PathVariable Long id) {
        return service.obtenerMiPedido(id);
    }

    // =========================
    // ADMIN → TODOS LOS PEDIDOS
    // =========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Pedido> listarTodos() {
        return service.listarPedidos();
    }

    // 👑 ADMIN → PEDIDO POR ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Pedido obtenerPorId(@PathVariable Long id) {
        return service.obtenerPedidoPorId(id);
    }

    // 👑 ADMIN → ACTUALIZAR
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Pedido actualizar(@PathVariable Long id, @RequestBody PedidoDTO dto) {
        return service.actualizarPedido(id, dto);
    }

    // 👑 ADMIN → ELIMINAR
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        service.eliminarPedido(id);
    }
}
