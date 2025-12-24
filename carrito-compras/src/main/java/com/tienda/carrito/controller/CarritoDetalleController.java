package com.tienda.carrito.controller;

import com.tienda.carrito.dto.CarritoDetalleDTO;
import com.tienda.carrito.model.CarritoDetalle;
import com.tienda.carrito.service.CarritoDetalleService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carrito-detalle")
@PreAuthorize("hasRole('CLIENTE')")
public class CarritoDetalleController {

    private final CarritoDetalleService service;

    public CarritoDetalleController(CarritoDetalleService service) {
        this.service = service;
    }

    @PostMapping
    public CarritoDetalle crear(@RequestBody CarritoDetalleDTO dto) {
        return service.crearDesdeDTO(dto);
    }

    @GetMapping
    public List<CarritoDetalle> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CarritoDetalle obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public CarritoDetalle actualizar(@PathVariable Long id, @RequestBody CarritoDetalleDTO dto) {
        return service.actualizarDesdeDTO(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
