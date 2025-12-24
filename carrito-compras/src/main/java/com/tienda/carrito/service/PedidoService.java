package com.tienda.carrito.service;

import com.tienda.carrito.dto.CrearPedidoDTO;
import com.tienda.carrito.dto.PedidoDTO;
import com.tienda.carrito.enums.EstadoCarrito;
import com.tienda.carrito.enums.EstadoPedido;
import com.tienda.carrito.exeption.AccesoDenegadoException;
import com.tienda.carrito.exeption.StockInsuficienteException;
import com.tienda.carrito.exeption.UsuarioNoAutenticadoException;
import com.tienda.carrito.model.*;
import com.tienda.carrito.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class PedidoService {

    private static final Logger log = LoggerFactory.getLogger(PedidoService.class);

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoDetalleRepository carritoDetalleRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // 🔐 Usuario autenticado desde JWT
    private Usuario obtenerUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNoAutenticadoException("Usuario autenticado no encontrado"));
    }

    // 🛒 Confirmar pedido desde carrito
    @Transactional
    public Pedido confirmarPedidoDesdeCarrito(CrearPedidoDTO dto) {
        Usuario usuario = obtenerUsuarioAutenticado();

        Carrito carrito = carritoRepository
                .findByUsuarioIdUsuarioAndEstado(usuario.getIdUsuario(), EstadoCarrito.ACTIVO)
                .orElseThrow(() -> new RuntimeException("No existe carrito activo"));

        List<CarritoDetalle> detalles = carritoDetalleRepository
                .findByCarritoIdCarrito(carrito.getIdCarrito());

        if (detalles.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        // Validar stock
        for (CarritoDetalle d : detalles) {
            Producto p = d.getProducto();
            if (p.getStock() < d.getCantidad()) {
                throw new StockInsuficienteException("Stock insuficiente para " + p.getNombre());
            }
        }

        // Descontar stock
        for (CarritoDetalle d : detalles) {
            Producto p = d.getProducto();
            p.setStock(p.getStock() - d.getCantidad());
            productoRepository.save(p);
        }

        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setDireccionEnvio(dto.getDireccionEnvio());
        pedido.setMetodoPago(dto.getMetodoPago());
        pedido.setFecha(new Date());

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Crear detalle pedido + calcular total
        BigDecimal total = BigDecimal.ZERO;

        for (CarritoDetalle d : detalles) {

            DetallePedido dp = new DetallePedido();
            dp.setPedido(pedidoGuardado);
            dp.setProducto(d.getProducto());
            dp.setCantidad(d.getCantidad());
            dp.setPrecioUnitario(d.getPrecioUnitario());

            // ✅ calcular subtotal
            BigDecimal subtotal = d.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(d.getCantidad()));

            dp.setSubtotal(subtotal);

            detallePedidoRepository.save(dp);

            // ✅ sumar al total
            total = total.add(subtotal);
        }

        pedidoGuardado.setTotal(total);
        pedidoRepository.save(pedidoGuardado);

        // Vaciar carrito
        carritoDetalleRepository.deleteByCarritoIdCarrito(carrito.getIdCarrito());
        carrito.setEstado(EstadoCarrito.COMPLETADO);
        carritoRepository.save(carrito);

        return pedidoGuardado;
    }

    // 📦 CLIENTE → Listar mis pedidos
    public Page<Pedido> listarMisPedidos(Pageable pageable) {
        Usuario usuario = obtenerUsuarioAutenticado();
        return pedidoRepository.findByUsuario(usuario, pageable);
    }

    public Pedido obtenerMiPedido(Long idPedido) {
        Usuario usuario = obtenerUsuarioAutenticado();
        return pedidoRepository.findByIdPedidoAndUsuario(idPedido, usuario)
                .orElseThrow(() -> {
                    log.warn("Acceso denegado: usuario {} intentó acceder al pedido {}", usuario.getEmail(), idPedido);
                    return new AccesoDenegadoException("No tienes permiso para acceder a este pedido");
                });
    }

    // 👑 ADMIN → Listar todos los pedidos
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    // 👑 ADMIN → Actualizar pedido
    public Pedido actualizarPedido(Long id, PedidoDTO dto) {
        Pedido pedido = obtenerPedidoPorId(id);

        if (dto.getTotal() != null) {
            pedido.setTotal(dto.getTotal());
        }

        if (dto.getEstado() != null) {
            try {
                pedido.setEstado(EstadoPedido.valueOf(dto.getEstado().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Estado inválido. Valores permitidos: PENDIENTE, PAGADO, CANCELADO, CERRADO");
            }
        }

        log.info("Pedido {} actualizado por ADMIN", id);
        return pedidoRepository.save(pedido);
    }

    // 👑 ADMIN → Eliminar pedido
    public void eliminarPedido(Long id) {
        log.warn("Pedido {} eliminado por ADMIN", id);
        pedidoRepository.deleteById(id);
    }

    // 🔧 Método opcional para limpiar pedidos antiguos con estado inválido
    @Transactional
    public void limpiarPedidosInvalidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        for (Pedido p : pedidos) {
            if (p.getEstado() == null) continue;
            try {
                EstadoPedido.valueOf(p.getEstado().name());
            } catch (IllegalArgumentException e) {
                log.warn("Pedido {} tenía estado inválido: {}. Se actualiza a PENDIENTE", p.getIdPedido(), p.getEstado());
                p.setEstado(EstadoPedido.PENDIENTE);
                pedidoRepository.save(p);
            }
        }
    }
}
