package com.tienda.carrito.service;

import com.tienda.carrito.model.RefreshToken;
import com.tienda.carrito.model.Usuario;
import com.tienda.carrito.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public RefreshToken create(Usuario usuario) {
        RefreshToken rt = new RefreshToken();
        rt.setUsuario(usuario);
        rt.setToken(UUID.randomUUID().toString());
        rt.setExpirationDate(Instant.now().plus(7, ChronoUnit.DAYS));
        return refreshTokenRepository.save(rt);
    }
}
