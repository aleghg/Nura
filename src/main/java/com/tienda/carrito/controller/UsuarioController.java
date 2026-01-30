package com.tienda.carrito.controller;

import com.tienda.carrito.dto.ActualizarPerfilDTO;
import com.tienda.carrito.dto.UsuarioDTO;
import com.tienda.carrito.exeption.UsuarioNoAutenticadoException;
import com.tienda.carrito.model.Usuario;
import com.tienda.carrito.service.UsuarioService;
import com.tienda.carrito.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 🔧 Constructor requerido (Spring lo inyecta solo)
    public UsuarioController(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    // ===============================
    // ✅ TU ENDPOINT ORIGINAL (NO BORRADO)

    @GetMapping("/me/simple")
    @PreAuthorize("hasAnyRole('CLIENTE','ADMIN')")
    public Usuario yo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoAutenticadoException("Usuario no encontrado"));
    }

    // ===============================
    // 🔹 Endpoint para que el usuario logueado vea su perfil
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('CLIENTE','ADMIN')")
    public ResponseEntity<Usuario> getPerfil(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(usuario);
    }

    // ===============================
    // 🔹 ACTUALIZAR PERFIL PROPIO
    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('CLIENTE','ADMIN')")
    public ResponseEntity<Usuario> actualizarPerfil(
            @Valid @RequestBody ActualizarPerfilDTO dto,
            Authentication auth
    ) {

        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Usuario actualizado;

        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            actualizado = usuarioService.actualizarPerfilSeguro(
                    usuario.getIdUsuario(),
                    dto.getNombre(),
                    dto.getEmail(),
                    dto.getCurrentPassword(),
                    dto.getNewPassword()
            );
        } else {
            usuario.setNombre(dto.getNombre());
            usuario.setEmail(dto.getEmail());
            actualizado = usuarioRepository.save(usuario);
        }

        actualizado.setPassword(null);
        return ResponseEntity.ok(actualizado);
    }

    // ===============================
    // ✅ Crear usuario (solo ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> crear(@Valid @RequestBody UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRol(dto.getRol());

        Usuario creado = usuarioService.crearUsuario(usuario);
        return ResponseEntity.ok(creado);
    }

    // ✅ Listar usuarios (solo ADMIN)
    @GetMapping("/listar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    // ✅ Obtener usuario por ID (solo ADMIN)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerUsuarioPorId(id));
    }

    // ✅ Actualizar usuario por ID (solo ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRol(dto.getRol());

        Usuario actualizado = usuarioService.actualizarUsuario(id, usuario);
        return ResponseEntity.ok(actualizado);
    }

    // ✅ Eliminar usuario por ID (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
