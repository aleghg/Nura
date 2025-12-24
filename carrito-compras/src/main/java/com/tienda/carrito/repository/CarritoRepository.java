
package com.tienda.carrito.repository;

import com.tienda.carrito.enums.EstadoCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tienda.carrito.model.Carrito;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    List<Carrito> findByUsuarioIdUsuario(Long idUsuario);

    List<Carrito> findByEstado(EstadoCarrito estado);

    Optional<Carrito> findByUsuarioIdUsuarioAndEstado(
            Long idUsuario,
            EstadoCarrito estado
    );

}
