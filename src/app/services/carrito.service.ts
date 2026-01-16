import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private API = `${environment.apiUrl}/carrito`;

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    };
  }

  // ➕ Agregar producto
  agregarProducto(productoId: number, cantidad: number): Observable<any> {
    return this.http.post(
      `${this.API}/agregar`,
      { productoId, cantidad },
      this.getHeaders()
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // ❌ Eliminar producto del carrito
  removerProducto(productoId: number): Observable<any> {
    return this.http.delete(
      `${this.API}/eliminar/${productoId}`,
      this.getHeaders()
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // 🛒 Obtener carrito del usuario
  obtenerCarrito(): Observable<any> {
    return this.http.get(
      `${this.API}`,
      this.getHeaders()
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
