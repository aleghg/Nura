package com.tienda.carrito.controller;

import com.tienda.carrito.config.JwtUtil;
import com.tienda.carrito.dto.AuthRequest;
import com.tienda.carrito.model.Rol;
import com.tienda.carrito.model.Usuario;
import com.tienda.carrito.repository.UsuarioRepository;
import com.tienda.carrito.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.tienda.carrito.dto.ResetPasswordDTO;
import com.tienda.carrito.service.UsuarioService;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 🔥 ESTA LÍNEA ES LA CLAVE
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Si llegamos aquí, la autenticación fue exitosa
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());

            return ResponseEntity.ok(new TokenResponse(token, usuario.getRol().name()));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Credenciales inválidas.");
        } catch (Exception ex) {
            // para debugging, devuelve 403 o 500 según prefieras; aquí devolvemos 403 para mantener coherencia
            return ResponseEntity.status(403).body("No autorizado: " + ex.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Usuario dto) {

        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado.");
        }

        Usuario nuevo = new Usuario();
        nuevo.setNombre(dto.getNombre());
        nuevo.setEmail(dto.getEmail());
        nuevo.setPassword(passwordEncoder.encode(dto.getPassword())); // 👈 ENCRIPTAR
        nuevo.setRol(dto.getRol() != null ? dto.getRol() : Rol.CLIENTE);// 👈 Dependiendo de tu enum

        usuarioRepository.save(nuevo);

        return ResponseEntity.ok("Usuario registrado correctamente");
    }


    // DTO respuesta token
    static class TokenResponse {
        private String token;
        private String rol;

        public TokenResponse(String token, String rol) {
            this.token = token;
            this.rol = rol;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getRol() {
            return rol;
        }

        public void setRol(String rol) {
            this.rol = rol;
        }
    }
}
