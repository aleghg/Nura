package com.tienda.carrito.dto;

public record UsuarioResponseDTO(
        Long id,
        String nombre,
        String email,
        String rol
) {
}
