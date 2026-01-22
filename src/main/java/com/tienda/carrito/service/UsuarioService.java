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

        // ✅ VALIDAR SI EL CORREO YA EXISTE
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Oracle asigna FECHA_REGISTRO automáticamente
        usuario.setFechaRegistro(null);

        // 🔐 Encriptar contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // 🔐 Asignar rol por defecto desde backend
        if (usuario.getRol() == null) {
            usuario.setRol(Rol.CLIENTE);
        }

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

            // ✅ SOLO ENCRIPTAR SI CAMBIA LA CONTRASEÑA
            if (datosUsuario.getPassword() != null && !datosUsuario.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(datosUsuario.getPassword()));
            }

            // No es necesario convertir el rol de String a Rol porque ahora ya está como Rol
            usuario.setRol(datosUsuario.getRol());

            return usuarioRepository.save(usuario);

        }).orElse(null);
    }

    // Eliminar usuario
    public void eliminarUsuario(Long id) {

        usuarioRepository.deleteById(id);
    }


    @Transactional
    public Usuario actualizarPerfilSeguro(
            Long idUsuario,
            String nombre,
            String email,
            String passwordActual,
            String nuevaPassword
    ) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 🛡️ Validar contraseña actual
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // ✏️ Actualizar datos básicos
        usuario.setNombre(nombre);
        usuario.setEmail(email);

        // 🔐 Encriptar NUEVA contraseña (UNA SOLA VEZ)
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));

        return usuarioRepository.save(usuario);
    }


}
