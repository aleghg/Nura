import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private API = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API)
      .pipe(
        catchError(err => {
          console.error('Error al obtener categorías', err);
          return throwError(() => err);
        })
      );
  }
}
