package com.tienda.carrito.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.tienda.carrito.enums.EstadoPedido;

@Entity
@Table(name = "PEDIDOS")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pedido_seq")
    @SequenceGenerator(
            name = "pedido_seq",
            sequenceName = "PEDIDO_SEQ",
            allocationSize = 1
    )
    @Column(name = "ID_PEDIDO")
    private Long idPedido;

    @ManyToOne
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

    @Temporal(TemporalType.TIMESTAMP)   // Oracle DATE incluye hora
    @Column(name = "FECHA")
    private Date fecha;

    @Column(name = "TOTAL", precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false)
    private EstadoPedido estado;

    @Column(name = "DIRECCION_ENVIO", length = 255)
    private String direccionEnvio;

    @Column(name = "METODO_PAGO", length = 50)
    private String metodoPago;


    @OneToMany(mappedBy = "pedido", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DetallePedido> detalles;

    // Getters & Setters

    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    // ✅ ESTE ERA EL QUE FALTABA
    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}