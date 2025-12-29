
package com.tienda.carrito.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tienda.carrito.model.CarritoDetalle;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoDetalleRepository extends JpaRepository<CarritoDetalle, Long> {

    // 🔍 Buscar detalle por carrito y producto
    Optional<CarritoDetalle> findByCarritoIdCarritoAndProductoIdProducto(
            Long idCarrito,
            Long idProducto
    );

    // 📋 Listar detalles de un carrito
    List<CarritoDetalle> findByCarritoIdCarrito(Long idCarrito);

    // 🧹 Eliminar todos los detalles de un carrito
    void deleteByCarritoIdCarrito(Long idCarrito);
}
