package com.tienda.carrito.service;

import com.tienda.carrito.dto.ProductoDTO;
import com.tienda.carrito.model.Categoria;
import com.tienda.carrito.model.Producto;
import com.tienda.carrito.repository.CategoriaRepository;
import com.tienda.carrito.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // =========================
    // CREAR
    // =========================
    public ProductoDTO crearProducto(ProductoDTO dto) {

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setCategoria(categoria);

        // BASE64 → BYTE[]
        if (dto.getImagenBase64() != null && !dto.getImagenBase64().isBlank()) {
            producto.setImagen(Base64.getDecoder().decode(dto.getImagenBase64()));
        }

        return mapToDTO(productoRepository.save(producto));
    }

    // =========================
    // LISTAR
    // =========================
    public List<ProductoDTO> listarProductos() {

        return productoRepository.findByActivoTrue()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ProductoDTO> listarPorCategoria(Long idCategoria) {
        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        return productoRepository.findByCategoriaAndActivoTrue(categoria)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }



    // =========================
    // OBTENER POR ID
    // =========================
    public ProductoDTO obtenerProductoPorId(Long id) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        return mapToDTO(producto);
    }

    // =========================
    // DESTACADOS
    // =========================
    public List<ProductoDTO> obtenerProductosDestacados() {
        return productoRepository
                .findTop8ByActivoTrueOrderByIdProductoDesc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // ACTUALIZAR
    // =========================
    public ProductoDTO actualizarProducto(Long id, ProductoDTO dto) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setCategoria(categoria);

        if (dto.getImagenBase64() != null && !dto.getImagenBase64().isBlank()) {
            producto.setImagen(Base64.getDecoder().decode(dto.getImagenBase64()));
        }

        return mapToDTO(productoRepository.save(producto));
    }

    // =========================
    // ELIMINAR LÓGICO
    // =========================
    public void eliminarProducto(Long id) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setActivo(false);
        productoRepository.save(producto);
    }

    // =========================
    // BUSCAR
    // =========================
    public Page<ProductoDTO> buscarPorNombre(String nombre, Pageable pageable) {

        return productoRepository
                .findByNombreContainingIgnoreCaseAndActivoTrue(nombre, pageable)
                .map(this::mapToDTO);
    }

    // =========================
    // ENTITY → DTO
    // =========================
    private ProductoDTO mapToDTO(Producto producto) {

        ProductoDTO dto = new ProductoDTO();
        dto.setIdProducto(producto.getIdProducto());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setIdCategoria(producto.getCategoria().getIdCategoria());

        if (producto.getImagen() != null) {
            dto.setImagenBase64(
                    Base64.getEncoder().encodeToString(producto.getImagen())
            );
        }

        return dto;
    }
}
