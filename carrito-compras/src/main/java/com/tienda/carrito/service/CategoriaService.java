package com.tienda.carrito.service;

import com.tienda.carrito.model.Categoria;
import com.tienda.carrito.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Normaliza el nombre solo si quieres limpiar espacios extra antes de guardar
    private String normalizarNombre(String nombre) {
        if (nombre == null) return null;
        return nombre.replaceAll("\\s+", " ").trim();
    }

    // Crear categoría
    public Categoria crearCategoria(Categoria categoria) {
        String nombreNormalizado = normalizarNombre(categoria.getNombre());

        if (categoriaRepository.existsByNombreNormalized(nombreNormalizado)) {
            throw new RuntimeException("La categoría ya existe");
        }

        categoria.setNombre(nombreNormalizado);
        return categoriaRepository.save(categoria);
    }

    // Listar todas las categorías
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    // Obtener categoría por ID
    public Categoria obtenerCategoriaPorId(Long id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    // Actualizar categoría
    public Categoria actualizarCategoria(Long id, Categoria categoria) {
        Categoria existente = categoriaRepository.findById(id).orElse(null);
        if (existente != null) {
            String nombreNormalizado = normalizarNombre(categoria.getNombre());

            // Validar duplicado en BD
            if (!existente.getNombre().equals(nombreNormalizado) &&
                    categoriaRepository.existsByNombreNormalized(nombreNormalizado)) {
                throw new RuntimeException("Ya existe otra categoría con ese nombre");
            }

            existente.setNombre(nombreNormalizado);
            existente.setDescripcion(categoria.getDescripcion());

            return categoriaRepository.save(existente);
        }
        return null;
    }

    // Eliminar categoría
    public void eliminarCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }
}
