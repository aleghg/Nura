import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from '../services/auth.service';

export interface Producto {
  idProducto: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export interface CarritoDetalle {
  idDetalle: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private carritoSubject = new BehaviorSubject<CarritoDetalle[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  private API_CLIENTE = `${environment.apiUrl}/carrito/mio`;
  private API_AGREGAR = `${environment.apiUrl}/carrito/agregar`;
  private API_ELIMINAR = `${environment.apiUrl}/carrito/eliminar`;
  private API_VACIAR = `${environment.apiUrl}/carrito/vaciar`;
  //private cargado = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    // 🔥 Cuando cambia el usuario → recargo carrito
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.cargarCarrito().subscribe();
      } else {
        this.carritoSubject.next([]);
      }
    });
  }

  /** 🔄 Cargar carrito */
  cargarCarrito(): Observable<CarritoDetalle[]> {

    //if (this.cargado) return of([]);
    //this.cargado = true;

    return this.http.get<CarritoDetalle[]>(this.API_CLIENTE).pipe(
      tap({
        next: items => {
          console.log('🛒 Carrito backend:', items);
          this.carritoSubject.next(items);
        },
        error: err => {
          console.error('Error cargando carrito', err);
          //this.cargado = false;
        }
      })
    );
  }

  refresh(): void {
    //this.cargado = false;
    this.cargarCarrito().subscribe();
  }

  /** ➕ Agregar producto */
  agregarProducto(idProducto: number, cantidad: number = 1): Observable<any> {
    return this.http.post(this.API_AGREGAR, {
      productoId: idProducto,
      cantidad
    }).pipe(tap(() => this.refresh()));
  }

  /** ❌ Eliminar producto */
  removerProducto(idProducto: number): Observable<any> {
    return this.http.delete(`${this.API_ELIMINAR}/${idProducto}`)
      .pipe(tap(() => this.refresh()));
  }

  /** 🧹 Vaciar carrito */
  limpiarCarrito(): Observable<any> {
    return this.http.delete(this.API_VACIAR)
      .pipe(tap(() => this.carritoSubject.next([])));
  }
}
