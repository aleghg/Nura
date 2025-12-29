package com.tienda.carrito.service;

import com.tienda.carrito.enums.EstadoCarrito;
import com.tienda.carrito.exeption.UsuarioNoAutenticadoException;
import com.tienda.carrito.model.Carrito;
import com.tienda.carrito.model.Usuario;
import com.tienda.carrito.repository.CarritoRepository;
import com.tienda.carrito.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tienda.carrito.dto.AgregarProductoDTO;
import com.tienda.carrito.model.CarritoDetalle;
import com.tienda.carrito.model.Producto;
import com.tienda.carrito.repository.CarritoDetalleRepository;
import com.tienda.carrito.repository.ProductoRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CarritoService {

    @PersistenceContext
    private EntityManager entityManager;
    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final CarritoDetalleRepository carritoDetalleRepository;

    public CarritoService(
            CarritoRepository carritoRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository,
            CarritoDetalleRepository carritoDetalleRepository
    ) {
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.carritoDetalleRepository = carritoDetalleRepository;
    }

    // 🔐 USUARIO AUTENTICADO
    private Usuario obtenerUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UsuarioNoAutenticadoException("Usuario no autenticado");
        }

        String email = auth.getName();

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsuarioNoAutenticadoException("Usuario autenticado no encontrado"));
    }


    private void recalcularTotal(Carrito carrito) {

        BigDecimal total = carritoDetalleRepository
                .findByCarritoIdCarrito(carrito.getIdCarrito())
                .stream()
                .map(CarritoDetalle::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        carrito.setTotal(total);
        carritoRepository.save(carrito);
    }


    // 🛒 OBTENER O CREAR CARRITO ACTIVO
    @Transactional
    public Carrito obtenerOCrearCarritoActivo() {
        Usuario usuario = obtenerUsuarioAutenticado();

        return carritoRepository
                .findByUsuarioIdUsuarioAndEstado(
                        usuario.getIdUsuario(),
                        EstadoCarrito.ACTIVO
                )
                .orElseGet(() -> {
                    Carrito nuevo = new Carrito();
                    nuevo.setUsuario(usuario);
                    nuevo.setEstado(EstadoCarrito.ACTIVO);
                    return carritoRepository.save(nuevo);
                });


    }

    // ➕ AGREGAR PRODUCTO
    @Transactional
    public Carrito agregarProducto(AgregarProductoDTO dto) {

        // 🔥 Limpia el contexto de Hibernate
        entityManager.clear();

        Usuario usuario = obtenerUsuarioAutenticado();

        Carrito carrito = obtenerOCrearCarritoActivo();

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (producto.getStock() < dto.getCantidad()) {
            throw new RuntimeException("Stock insuficiente");
        }

        CarritoDetalle detalle = carritoDetalleRepository
                .findByCarritoIdCarritoAndProductoIdProducto(
                        carrito.getIdCarrito(),
                        producto.getIdProducto()
                )
                .orElse(null);

        if (detalle != null) {

            detalle.setCantidad(detalle.getCantidad() + dto.getCantidad());

        } else {

            detalle = new CarritoDetalle();
            detalle.setCarrito(carrito);
            detalle.setProducto(producto);
            detalle.setCantidad(dto.getCantidad());

            // ✅ PRECIO CONGELADO AL AGREGAR AL CARRITO
            detalle.setPrecioUnitario(producto.getPrecio());

            carrito.getDetalles().add(detalle);
        }


        // 🔥 CALCULAR SUBTOTAL
        detalle.setSubtotal(
                producto.getPrecio()
                        .multiply(BigDecimal.valueOf(detalle.getCantidad()))
        );

        carritoDetalleRepository.save(detalle);

        // 🔥 RECALCULAR TOTAL
        recalcularTotal(carrito);

        return carrito;
    }

    @Transactional
    public CarritoDetalle actualizarCantidad(Long detalleId, int cantidad) {

        if (cantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a cero");
        }

        CarritoDetalle detalle = carritoDetalleRepository.findById(detalleId)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));

        Producto producto = detalle.getProducto();

        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente");
        }

        detalle.setCantidad(cantidad);
        detalle.setSubtotal(
                detalle.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(cantidad))
        );

        carritoDetalleRepository.save(detalle);

        // 🔥 recalcular total
        recalcularTotal(detalle.getCarrito());

        return detalle;
    }


    // 📋 VER MI CARRITO
    @Transactional(readOnly = true)
    public List<CarritoDetalle> verMiCarrito() {
        Carrito carrito = obtenerOCrearCarritoActivo();
        return carritoDetalleRepository.findByCarritoIdCarrito(
                carrito.getIdCarrito()
        );
    }

    // ➖ ELIMINAR PRODUCTO DEL CARRITO
    @Transactional
    public void eliminarProducto(Long idProducto) {

        Carrito carrito = obtenerOCrearCarritoActivo();

        CarritoDetalle detalle = carritoDetalleRepository
                .findByCarritoIdCarritoAndProductoIdProducto(
                        carrito.getIdCarrito(),
                        idProducto
                )
                .orElseThrow(() -> new RuntimeException("Producto no está en el carrito"));

        carritoDetalleRepository.delete(detalle);

        // 🔥 recalcular total
        recalcularTotal(carrito);
    }


    // 🧹 VACIAR CARRITO
    @Transactional
    public void vaciarCarrito() {
        Carrito carrito = obtenerOCrearCarritoActivo();

        carritoDetalleRepository.deleteByCarritoIdCarrito(
                carrito.getIdCarrito()
        );

        carrito.setTotal(BigDecimal.ZERO);
        carritoRepository.save(carrito);
    }


    // ⚠️ SOLO PARA ADMIN / DEBUG
    public List<Carrito> listar() {
        return carritoRepository.findAll();
    }

    public Carrito obtenerPorId(Long id) {
        return carritoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
    }

    @Transactional
    public Carrito actualizarEstado(Long idCarrito, EstadoCarrito estado) {

        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        carrito.setEstado(estado);
        return carritoRepository.save(carrito);
    }


    public void eliminar(Long id) {
        carritoRepository.deleteById(id);
    }
}
