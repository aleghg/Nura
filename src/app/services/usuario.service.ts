import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  // 🔐 PERFIL DEL USUARIO LOGUEADO
  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/me`);
  }

  // 👑 SOLO ADMIN
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}/listar`);
  }

  // ➕ CREAR USUARIO (ADMIN o REGISTER)
  crearUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, usuario);
  }

  // 🛒 AGREGAR AL CARRITO (USUARIO LOGUEADO)
  agregarAlCarrito(productoId: number, cantidad: number): Observable<void> {
    return this.http.post<void>(`${this.API}/carrito`, {
      productoId,
      cantidad
    });
  }
}
