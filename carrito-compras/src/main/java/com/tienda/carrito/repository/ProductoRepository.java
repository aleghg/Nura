
package com.tienda.carrito.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;
import com.tienda.carrito.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByPrecioBetween(Double min, Double max);

    List<Producto> findByCategoriaIdCategoria(Long idCategoria);

    List<Producto> findByActivoTrue();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Producto> findById(Long id);
    
    Page<Producto> findByNombreContainingIgnoreCaseAndActivoTrue(
            String nombre,
            Pageable pageable
    );


}
