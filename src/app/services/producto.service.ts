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

  private API = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API)
      .pipe(
        catchError(err => {
          console.error('Error al obtener productos', err);
          return throwError(() => err); // para que ErrorInterceptor lo capture también
        })
      );
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API}/${id}`)
      .pipe(
        catchError(err => {
          console.error(`Error al obtener producto con ID ${id}`, err);
          return throwError(() => err);
        })
      );
  }

  getFeaturedProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API}/featured`)
      .pipe(
        catchError(err => {
          console.error('Error al obtener productos destacados', err);
          return throwError(() => err);
        })
      );
  }
}
