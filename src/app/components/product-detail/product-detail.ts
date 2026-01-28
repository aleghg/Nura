import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {

  producto!: Producto;
  cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.producto = this.route.snapshot.data['producto'];
  }

  /// 🛒 Agregar al carrito
  add(): void {
  console.log('🛒 Click AGREGAR A LA BOLSA:', this.producto.idProducto);
  this.cartService.agregarProducto(this.producto.idProducto, this.cantidad).subscribe();
}


  // 🖼️ Imagen optimizada
  getImagen(): string {
    return this.producto?.imagenBase64
      ? 'data:image/jpeg;base64,' + this.producto.imagenBase64.replace(/\s/g, '')
      : 'assets/no-image.png';
  }
}