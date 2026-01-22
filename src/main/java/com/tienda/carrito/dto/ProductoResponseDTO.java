package com.tienda.carrito.dto;

import java.math.BigDecimal;

public class ProductoResponseDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String categoria;

    // ===== CONSTRUCTOR =====
    public ProductoResponseDTO(
            Long id,
            String nombre,
            String descripcion,
            BigDecimal precio,
            Integer stock,
            String categoria
    ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }

    // ===== GETTERS =====
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public Integer getStock() {
        return stock;
    }

    public String getCategoria() {
        return categoria;
    }
}
