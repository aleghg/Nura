package com.tienda.carrito.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.tienda.carrito.model.Categoria;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Buscar categoría normalizando: trim + lower
    @Query("SELECT c FROM Categoria c WHERE LOWER(TRIM(c.nombre)) = LOWER(TRIM(:nombre))")
    Optional<Categoria> findByNombreNormalized(@Param("nombre") String nombre);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Categoria c " +
            "WHERE LOWER(TRIM(c.nombre)) = LOWER(TRIM(:nombre))")
    boolean existsByNombreNormalized(@Param("nombre") String nombre);
}