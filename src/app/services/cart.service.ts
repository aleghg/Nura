import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  idProducto: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  // Lista interna de productos
  private items: CartItem[] = [];

  // Observable para notificar cambios
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  // Obtener todos los productos
  getCart(): CartItem[] {
    return [...this.items];
  }

  // Agregar producto
  add(producto: any) {
    const existing = this.items.find(p => p.idProducto === producto.idProducto);
    if (existing) {
      existing.cantidad++;
    } else {
      this.items.push({
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      });
    }
    this.cartSubject.next(this.getCart());
  }

  // Quitar producto
  remove(productoId: number) {
    this.items = this.items.filter(p => p.idProducto !== productoId);
    this.cartSubject.next(this.getCart());
  }

  // Vaciar carrito
  clear() {
    this.items = [];
    this.cartSubject.next(this.getCart());
  }

  // Total
  total(): number {
    return this.items.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  // Cantidad total
  totalCantidad(): number {
    return this.items.reduce((acc, p) => acc + p.cantidad, 0);
  }
}
