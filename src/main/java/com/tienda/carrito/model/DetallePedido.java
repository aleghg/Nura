package com.tienda.carrito.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "DETALLE_PEDIDO")

public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "detalle_pedido_seq")
    @SequenceGenerator(
            name = "detalle_pedido_seq",
            sequenceName = "DETALLE_PEDIDO_SEQ",
            allocationSize = 1
    )
    @Column(name = "ID_DETALLE")
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "PRECIO_UNITARIO", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "SUBTOTAL", insertable = false, updatable = false)
    private BigDecimal subtotal;


    // Getters y Setters
    public Long getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(Long idDetalle) {
        this.idDetalle = idDetalle;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
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
}
