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

  // ✅ ÚNICA fuente de verdad
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  // 🔹 Getter seguro
  private get items(): CartItem[] {
    return this.cartSubject.value ?? [];
  }

  // =============================
  // ➕ AGREGAR PRODUCTO
  // =============================
  add(producto: any): void {
    const items = [...this.items];

    const existing = items.find(
      p => p.idProducto === producto.idProducto
    );

    if (existing) {
      existing.cantidad += 1;
    } else {
      items.push({
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      });
    }

    this.cartSubject.next(items);
  }

  // =============================
  // ➖ QUITAR PRODUCTO
  // =============================
  remove(productoId: number): void {
    const items = this.items.filter(
      p => p.idProducto !== productoId
    );
    this.cartSubject.next(items);
  }

  // =============================
  // 🧹 VACIAR CARRITO
  // =============================
  clear(): void {
    this.cartSubject.next([]);
  }

  // =============================
  // 🔢 TOTAL PRECIO
  // =============================
  total(): number {
    return this.items.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  }

  // =============================
  // 🔢 TOTAL CANTIDAD
  // =============================
  totalCantidad(): number {
    return this.items.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }
}
