import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Producto } from '../models/producto.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private API = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) {}

  getFeaturedProducts() {
  return this.http.get<any[]>(`${this.API}/featured`);
}


   getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API);
  }
}
