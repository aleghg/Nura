package com.tienda.carrito.dto;


import jakarta.validation.constraints.*;

public class CarritoDTO {
    @NotNull(message = "Debe indicar el usuario")
    private Long idUsuario;

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "ACTIVO|COMPLETADO|ABANDONADO", message = "Estado inválido")
    private String estado;

    // Getters y Setters
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
