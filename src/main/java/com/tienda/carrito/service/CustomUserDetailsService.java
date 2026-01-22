package com.tienda.carrito.service;

import com.tienda.carrito.model.Usuario;
import com.tienda.carrito.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 🔹 Buscar usuario en BD por email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        // 🔹 Devuelve UserDetails con rol prefijado ROLE_ (para @PreAuthorize)
        return User.withUsername(usuario.getEmail())   // username siempre será email
                .password(usuario.getPassword())       // contraseña encriptada desde la BD
                .authorities("ROLE_" + usuario.getRol().name())  // IMPORTANTE: Spring requiere ROLE_
                .build();
    }
}

