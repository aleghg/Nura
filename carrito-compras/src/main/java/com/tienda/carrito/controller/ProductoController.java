package com.tienda.carrito.controller;

import com.tienda.carrito.dto.ProductoDTO;
import com.tienda.carrito.model.Producto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import com.tienda.carrito.service.ProductoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> crearProducto(
            @Valid @RequestBody ProductoDTO dto) {

        Producto producto = service.crearProducto(dto);
        return ResponseEntity.status(201).body(producto);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
    public List<Producto> listar() {
        return service.listarProductos();

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
    public Producto obtener(@PathVariable Long id) {
        return service.obtenerProductoPorId(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Producto actualizar(@PathVariable Long id, @Valid @RequestBody ProductoDTO dto) {
        return service.actualizarProducto(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        service.eliminarProducto(id);
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENTE')")
    public Page<Producto> buscar(
            @RequestParam String nombre,
            Pageable pageable) {

        return service.buscarPorNombre(nombre, pageable);
    }

}
