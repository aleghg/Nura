package com.tienda.carrito.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tienda.carrito.enums.EstadoCarrito;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "CARRITOS")
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "carrito_seq")
    @SequenceGenerator(
            name = "carrito_seq",
            sequenceName = "CARRITO_SEQ",
            allocationSize = 1
    )

    @Column(name = "ID_CARRITO")
    private Long idCarrito;

    // ✅  Un usuario tiene un solo carrito activo
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false, unique = true)
    @JsonIgnore
    private Usuario usuario;

    // ✅ Total del carrito (se recalcula desde el service)
    @Column(name = "TOTAL", precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "FECHA_CREACION", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // se actualiza cada vez que cambia el carrito
    @Column(name = "FECHA_ACTUALIZACION")
    private LocalDateTime fechaActualizacion;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO")
    private EstadoCarrito estado;

    // ✅ IMPORTANTE: inicializar la lista
    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CarritoDetalle> detalles = new ArrayList<>();


    // ======================
    // CALLBACKS JPA
    // ======================
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        this.estado = EstadoCarrito.ACTIVO;
        this.total = BigDecimal.ZERO;
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // ======================
    // GETTERS Y SETTERS
    // ======================
    public Long getIdCarrito() {
        return idCarrito;
    }

    public void setIdCarrito(Long idCarrito) {
        this.idCarrito = idCarrito;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public EstadoCarrito getEstado() {
        return estado;
    }

    public void setEstado(EstadoCarrito estado) {
        this.estado = estado;
    }

    public List<CarritoDetalle> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<CarritoDetalle> detalles) {
        this.detalles = detalles;
    }
}