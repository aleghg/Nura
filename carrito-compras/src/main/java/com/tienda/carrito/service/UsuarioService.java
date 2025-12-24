package com.tienda.carrito.service;

import com.tienda.carrito.model.Carrito;
import com.tienda.carrito.model.Rol;
import com.tienda.carrito.model.Usuario;
import com.tienda.carrito.repository.CarritoRepository;
import com.tienda.carrito.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ============================
    // CREAR USUARIO + CREAR CARRITO
    // ============================
    @Transactional
    public Usuario crearUsuario(Usuario usuario) {

        // Oracle asigna FECHA_REGISTRO automáticamente
        usuario.setFechaRegistro(null);

        // 🔐 Encriptar contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // 🔐 Asignar rol por defecto desde backend
        usuario.setRol(Rol.CLIENTE);

        // Guardar usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // 🛒 Crear carrito automáticamente
        Carrito carrito = new Carrito();
        carrito.setUsuario(usuarioGuardado);
        
        // 🔗 Enlazar ambos lados
        usuarioGuardado.setCarrito(carrito);


        carritoRepository.save(carrito);

        return usuarioGuardado;
    }

    // Listar usuarios
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Buscar usuario por ID
    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // Actualizar usuario
    public Usuario actualizarUsuario(Long id, Usuario datosUsuario) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(datosUsuario.getNombre());
            usuario.setEmail(datosUsuario.getEmail());
            usuario.setPassword(datosUsuario.getPassword());

            // No es necesario convertir el rol de String a Rol porque ahora ya está como Rol
            usuario.setRol(datosUsuario.getRol());

            return usuarioRepository.save(usuario);

        }).orElse(null);
    }

    // Eliminar usuario
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }
}
