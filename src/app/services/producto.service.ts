import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private API = `${environment.apiUrl}/productos`; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // 🔹 Todos los productos
  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API)
      .pipe(
        catchError(err => {
          console.error('Error al obtener productos', err);
          return throwError(() => err);
        })
      );
  }

  // 🔹 Producto por ID
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API}/${id}`)
      .pipe(
        catchError(err => {
          console.error(`Error al obtener producto con ID ${id}`, err);
          return throwError(() => err);
        })
      );
  }

  // 🔹 Productos destacados (si tu backend lo soporta)
  getFeaturedProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API}/destacados`)
      .pipe(
        catchError(err => {
          console.error('Error al obtener productos destacados', err);
          return throwError(() => err);
        })
      );
  }

}
