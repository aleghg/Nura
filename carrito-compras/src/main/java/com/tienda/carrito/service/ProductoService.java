package com.tienda.carrito.service;

import com.tienda.carrito.model.Producto;
import com.tienda.carrito.model.Categoria;
import com.tienda.carrito.dto.ProductoDTO;
import com.tienda.carrito.repository.ProductoRepository;
import com.tienda.carrito.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;


    // Crear producto desde DTO
    public Producto crearProducto(ProductoDTO dto) {


        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())

                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setImagen(dto.getImagen());
        producto.setCategoria(categoria);


        return productoRepository.save(producto);
    }

    // Listar productos
    public List<Producto> listarProductos() {
        return productoRepository.findByActivoTrue();
    }


    // Obtener producto por ID
    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // Actualizar producto desde DTO
    public Producto actualizarProducto(Long id, ProductoDTO dto) {

        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        existente.setNombre(dto.getNombre());
        existente.setDescripcion(dto.getDescripcion());
        existente.setPrecio(dto.getPrecio());
        existente.setStock(dto.getStock());
        existente.setImagen(dto.getImagen());
        existente.setCategoria(categoria);

        return productoRepository.save(existente);
    }

    // Eliminar producto
    public void eliminarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setActivo(false);
        productoRepository.save(producto);
    }

    // 🔍 Búsqueda con paginación (producción)
    public Page<Producto> buscarPorNombre(String nombre, Pageable pageable) {
        return productoRepository
                .findByNombreContainingIgnoreCaseAndActivoTrue(nombre, pageable);
    }


}
