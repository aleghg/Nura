import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;

  constructor(private http: HttpClient) {}
 

  ngOnInit(): void {
    const token = localStorage.getItem('token')!;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Usuario>(`${environment.apiUrl}/usuarios/me`, { headers })
      .subscribe({
        next: (res) => this.usuario = res,
        error: (err) => console.error('Error al obtener perfil', err)
      });
  }
}