import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface CarritoItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // Observable para mantener el estado del carrito en tiempo real
  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]);
  carrito$ = this.carritoSubject.asObservable();

private API_CLIENTE = `${environment.apiUrl}/carrito/mio`;
private API_AGREGAR = `${environment.apiUrl}/carrito/agregar`;
private API_ELIMINAR = `${environment.apiUrl}/carrito/eliminar`;
private API_VACIAR = `${environment.apiUrl}/carrito/vaciar`;

  constructor(private http: HttpClient) {
    // Cargar carrito al iniciar el servicio
    this.cargarCarrito();
  }

  /** 🔹 Crear headers con token */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);// <-- Verifica que exista
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** Cargar carrito del cliente */
cargarCarrito(): void {
  this.http.get<CarritoItem[]>(this.API_CLIENTE, { headers: this.getAuthHeaders() })
    .subscribe(
      items => this.carritoSubject.next(items),
      err => console.error('Error cargando carrito', err)
    );
}

/** Agregar producto */
agregarProducto(idProducto: number, cantidad: number = 1): Observable<any> {
  return this.http.post(this.API_AGREGAR, { idProducto, cantidad }, { headers: this.getAuthHeaders() })
    .pipe(tap(() => this.cargarCarrito()));
}

/** Remover producto */
removerProducto(idProducto: number): void {
  this.http.delete(`${this.API_ELIMINAR}/${idProducto}`, { headers: this.getAuthHeaders() })
    .subscribe(() => this.cargarCarrito(), err => console.error('Error removiendo item', err));
}

/** Vaciar carrito */
limpiarCarrito(): void {
  this.http.delete(this.API_VACIAR, { headers: this.getAuthHeaders() })
    .subscribe(() => this.carritoSubject.next([]), err => console.error('Error limpiando carrito', err));
}

}
