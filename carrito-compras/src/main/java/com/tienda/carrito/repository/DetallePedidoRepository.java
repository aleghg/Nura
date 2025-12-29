
package com.tienda.carrito.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tienda.carrito.model.DetallePedido;
import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    List<DetallePedido> findByPedidoIdPedido(Long idPedido);
    List<DetallePedido> findByProductoIdProducto(Long idProducto);
}
