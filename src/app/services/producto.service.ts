import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private API = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) {}

  // 🔹 Listar todos los productos
  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API);
  }

  // 🔹 Obtener producto por ID (detalle)
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API}/${id}`);
  }

  // 🔹 Productos destacados
  getFeaturedProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API}/featured`);
  }
}
