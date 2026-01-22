package com.tienda.carrito.controller;

import com.tienda.carrito.dto.ProductoDTO;
import com.tienda.carrito.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    // =========================
    // CREAR
    // =========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDTO> crearProducto(
            @Valid @RequestBody ProductoDTO dto) {

        return ResponseEntity.status(201).body(service.crearProducto(dto));
    }

    // =========================
    // LISTAR
    // =========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
    public List<ProductoDTO> listar() {
        return service.listarProductos();
    }

    // =========================
    // OBTENER POR ID
    // =========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
    public ProductoDTO obtener(@PathVariable Long id) {
        return service.obtenerProductoPorId(id);
    }


    @GetMapping("/categoria/{idCategoria}")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
    public List<ProductoDTO> listarPorCategoria(@PathVariable Long idCategoria) {
        return service.listarPorCategoria(idCategoria);
    }

    // =========================
    // ACTUALIZAR
    // =========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProductoDTO actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoDTO dto) {

        return service.actualizarProducto(id, dto);
    }

    // =========================
    // ELIMINAR LÓGICO
    // =========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        service.eliminarProducto(id);
    }

    // =========================
    // BUSCAR
    // =========================
    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
    public Page<ProductoDTO> buscar(
            @RequestParam String nombre,
            Pageable pageable) {

        return service.buscarPorNombre(nombre, pageable);
    }

    // =========================
    // PRODUCTOS DESTACADOS (PÚBLICO)
    // =========================
    @GetMapping("/featured")
    public List<ProductoDTO> productosDestacados() {
        return service.obtenerProductosDestacados();
    }
}
