package com.tienda.carrito.service;

import com.tienda.carrito.dto.CarritoDetalleDTO;
import com.tienda.carrito.model.Carrito;
import com.tienda.carrito.model.CarritoDetalle;
import com.tienda.carrito.model.Producto;
import com.tienda.carrito.repository.CarritoDetalleRepository;
import com.tienda.carrito.repository.CarritoRepository;
import com.tienda.carrito.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarritoDetalleService {

    private final CarritoDetalleRepository carritoDetalleRepository;
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;

    public CarritoDetalleService(CarritoDetalleRepository carritoDetalleRepository,
                                 CarritoRepository carritoRepository,
                                 ProductoRepository productoRepository) {
        this.carritoDetalleRepository = carritoDetalleRepository;
        this.carritoRepository = carritoRepository;
        this.productoRepository = productoRepository;
    }

    // Crear desde DTO
    public CarritoDetalle crearDesdeDTO(CarritoDetalleDTO dto) {

        Carrito carrito = carritoRepository.findById(dto.getIdCarrito())
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        CarritoDetalle det = new CarritoDetalle();
        det.setCarrito(carrito);
        det.setProducto(producto);
        det.setCantidad(dto.getCantidad());

        /// ✔️ SOLO columnas reales
        det.setPrecioUnitario(producto.getPrecio());

        return carritoDetalleRepository.save(det);
    }

    // Listar todo
    public List<CarritoDetalle> listar() {
        return carritoDetalleRepository.findAll();
    }

    // Obtener por ID
    public CarritoDetalle obtenerPorId(Long id) {
        return carritoDetalleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));
    }

    // Actualizar
    public CarritoDetalle actualizarDesdeDTO(Long id, CarritoDetalleDTO dto) {

        CarritoDetalle existente = carritoDetalleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));

        existente.setCantidad(dto.getCantidad());
        existente.setPrecioUnitario(existente.getProducto().getPrecio());

        return carritoDetalleRepository.save(existente);
    }

    // Eliminar
    public void eliminar(Long id) {
        carritoDetalleRepository.deleteById(id);
    }
}
