import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {

  producto!: Producto;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.obtenerProducto();
  }

  // 🔹 Obtener producto por ID desde backend
  obtenerProducto(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productoService.getById(id).subscribe({
      next: (data: Producto) => {
        this.producto = data;
      },
      error: (err: any) => {
        console.error('Error al cargar producto', err);
      }
    });
  }

  // 🛒 Agregar al carrito
  add(): void {
    this.cartService.add(this.producto);
  }

  // 🖼️ Renderizar imagen Base64
  getImagen(): string {
    if (!this.producto?.imagen) {
      return 'assets/no-image.png'; // opcional
    }
    return 'data:image/jpeg;base64,' + this.producto.imagen;
  }
}
