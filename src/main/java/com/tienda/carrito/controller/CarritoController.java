package com.tienda.carrito.controller;

import com.tienda.carrito.dto.ActualizarEstadoCarritoDTO;
import com.tienda.carrito.dto.AgregarProductoDTO;
import com.tienda.carrito.model.Carrito;
import com.tienda.carrito.service.CarritoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/carrito")
public class CarritoController {

    private final CarritoService service;

    public CarritoController(CarritoService service) {
        this.service = service;
    }

    // =========================
    // 🛒 CLIENTE
    // =========================

    // ➕ AGREGAR PRODUCTO
    @PostMapping("/agregar")
    @PreAuthorize("hasRole('CLIENTE')")
    public Carrito agregar(@RequestBody AgregarProductoDTO dto) {
        return service.agregarProducto(dto);
    }

    // 👀 VER MI CARRITO (DETALLES)
    @GetMapping("/mio")
    @PreAuthorize("hasRole('CLIENTE')")
    public List<?> verMiCarrito() {
        return service.verMiCarrito();
    }

    // ➖ ELIMINAR PRODUCTO DEL CARRITO
    @DeleteMapping("/eliminar/{idProducto}")
    @PreAuthorize("hasRole('CLIENTE')")
    public void eliminarProducto(@PathVariable Long idProducto) {
        service.eliminarProducto(idProducto);
    }

    // 🧹 VACIAR CARRITO
    @DeleteMapping("/vaciar")
    @PreAuthorize("hasRole('CLIENTE')")
    public void vaciarCarrito() {
        service.vaciarCarrito();
    }

    // =========================
    // 👑 ADMIN
    // =========================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Carrito> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Carrito obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PutMapping("/admin/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public void actualizarEstado(
            @PathVariable Long id,
            @RequestBody @Valid ActualizarEstadoCarritoDTO dto) {

        service.actualizarEstado(id, dto.getEstado());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
