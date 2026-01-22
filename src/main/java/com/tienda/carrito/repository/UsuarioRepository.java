package com.tienda.carrito.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tienda.carrito.model.Usuario;
import com.tienda.carrito.model.Rol;
import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // OBLIGATORIO para login JWT
    Optional<Usuario> findByEmail(String email);

    // Para evitar registros duplicados
    boolean existsByEmail(String email);

    // Listar usuarios por enum Rol (más seguro que usar String)
    List<Usuario> findByRol(Rol rol);

}
