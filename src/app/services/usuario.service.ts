import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  const token = localStorage.getItem('token')!;
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<Usuario>(`${this.API}/me`, { headers });
}

actualizarPerfil(usuario: any): Observable<Usuario> {
  const token = localStorage.getItem('token')!;
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put<Usuario>(`${this.API}/me`, usuario, { headers });
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
