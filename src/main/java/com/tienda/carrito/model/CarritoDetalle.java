package com.tienda.carrito.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "CARRITO_DETALLE")
public class CarritoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "detalle_seq")
    @SequenceGenerator(
            name = "detalle_seq",
            sequenceName = "DETALLE_SEQ",
            allocationSize = 1
    )

    @Column(name = "ID_DETALLE")
    private Long idDetalle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CARRITO", nullable = false)
    @JsonIgnore
    private Carrito carrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PRODUCTO", nullable = false)
    private Producto producto;

    @Column(name = "CANTIDAD", nullable = false)
    private Integer cantidad;

    @Column(name = "PRECIO_UNITARIO", precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "SUBTOTAL", precision = 10, scale = 2)
    private BigDecimal subtotal;

    // Getters y Setters
    public Long getIdDetalle() {
        return idDetalle;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

}