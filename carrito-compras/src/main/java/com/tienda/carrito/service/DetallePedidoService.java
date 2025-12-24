package com.tienda.carrito.service;

import com.tienda.carrito.dto.DetallePedidoDTO;
import com.tienda.carrito.model.DetallePedido;
import com.tienda.carrito.model.Pedido;
import com.tienda.carrito.model.Producto;
import com.tienda.carrito.repository.DetallePedidoRepository;
import com.tienda.carrito.repository.PedidoRepository;
import com.tienda.carrito.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detalleRepo;

    @Autowired
    private PedidoRepository pedidoRepo;

    @Autowired
    private ProductoRepository productoRepo;

    public DetallePedido crearDetalleDesdeDTO(DetallePedidoDTO dto) {

        Pedido pedido = pedidoRepo.findById(dto.getIdPedido())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Producto producto = productoRepo.findById(dto.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        DetallePedido detalle = new DetallePedido();
        detalle.setPedido(pedido);
        detalle.setProducto(producto);
        detalle.setCantidad(dto.getCantidad());

        // ✅ PRECIO DEL PRODUCTO EN ESE MOMENTO
        detalle.setPrecioUnitario(producto.getPrecio());

        // ❌ NO setear subtotal (Oracle lo calcula)
        return detalleRepo.save(detalle);
    }

    public List<DetallePedido> listar() {
        return detalleRepo.findAll();
    }

    public List<DetallePedido> listarPorPedido(Long idPedido) {
        return detalleRepo.findByPedidoIdPedido(idPedido);
    }
}
