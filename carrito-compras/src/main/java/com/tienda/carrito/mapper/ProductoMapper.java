package com.tienda.carrito.mapper;

import com.tienda.carrito.dto.ProductoResponseDTO;
import com.tienda.carrito.model.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public ProductoResponseDTO toDto(Producto producto) {
        if (producto == null) {
            return null;
        }

        return new ProductoResponseDTO(
                producto.getIdProducto(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),          // ✅ BigDecimal
                producto.getStock(),
                producto.getCategoria().getNombre()
        );
    }
}
