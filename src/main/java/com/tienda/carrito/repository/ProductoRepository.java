package com.tienda.carrito.repository;

import com.tienda.carrito.model.Categoria;
import com.tienda.carrito.model.Producto;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // =========================
    // LISTAR ACTIVOS
    // =========================
    List<Producto> findByActivoTrue();

    // =========================
    // BUSCAR POR NOMBRE (ACTIVOS)
    // =========================
    Page<Producto> findByNombreContainingIgnoreCaseAndActivoTrue(
            String nombre,
            Pageable pageable
    );

    // =========================
    // FILTRAR POR CATEGORIA
    // =========================
    List<Producto> findByCategoria_IdCategoriaAndActivoTrue(Long idCategoria);

    // =========================
    // FILTRAR POR PRECIO
    // =========================
    List<Producto> findByPrecioBetweenAndActivoTrue(
            Double min,
            Double max
    );

    // =========================
    // PRODUCTOS DESTACADOS (ÚLTIMOS 8)
    // =========================
    List<Producto> findTop8ByActivoTrueOrderByIdProductoDesc();

    // =========================
    // BLOQUEO PARA STOCK
    // =========================
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Producto> findById(Long id);

    //productos filtrados por categoría.
    List<Producto> findByCategoriaAndActivoTrue(Categoria categoria);

}
