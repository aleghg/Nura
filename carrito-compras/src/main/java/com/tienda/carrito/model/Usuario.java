package com.tienda.carrito.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "USUARIOS")  // Debe coincidir con la tabla exacta en Oracle
public class Usuario {

    @OneToOne(mappedBy = "usuario", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    private Carrito carrito;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usuario_seq") // Oracle 12c+ lo soporta
    @SequenceGenerator(
            name = "usuario_seq",
            sequenceName = "USUARIO_SEQ",
            allocationSize = 1
    )
    @Column(name = "ID_USUARIO")
    private Long idUsuario;

    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "PASSWORD", nullable = false, length = 200)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROL", length = 20)
    private Rol rol;

    @CreationTimestamp   // Oracle DATE incluye hora
    @Column(name = "FECHA_REGISTRO")
    private Date fechaRegistro; // lo deja null para que Oracle ponga SYSDATE

    // Getters y Setters
    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRol() {
        return rol;
    }  // Correcto, devuelve un Rol

    public void setRol(Rol rol) {
        this.rol = rol;
    }  // Correcto, acepta un Rol

    public Date getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(Date fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }


}
