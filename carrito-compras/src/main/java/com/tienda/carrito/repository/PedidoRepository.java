package com.tienda.carrito.repository;

import com.tienda.carrito.model.Pedido;
import com.tienda.carrito.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // CLIENTE → ver solo sus pedidos
    List<Pedido> findByUsuario(Usuario usuario);

    // 🔐 FASE 5 → validar propiedad del pedido
    Optional<Pedido> findByIdPedidoAndUsuario(Long idPedido, Usuario usuario);

    // Opcional
    List<Pedido> findByEstado(String estado);

    Page<Pedido> findByUsuario(Usuario usuario, Pageable pageable);

}
