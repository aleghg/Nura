import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../../models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {

  usuario!: Usuario;
  perfilForm!: FormGroup;
  mensaje = ''; // Mensaje de éxito o error

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 🔹 Obtener perfil
    this.http.get<Usuario>(`${environment.apiUrl}/usuarios/me`, { headers })
      .subscribe({
        next: (res) => {
          this.usuario = res;

          // Inicializar formulario con los datos del usuario
          this.perfilForm = this.fb.group({
            nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(3)]],
            email: [this.usuario.email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]], // opcional, solo si quiere cambiar
          });
        },
        error: (err) => console.error('Error al obtener perfil', err)
      });
  }

  // 🔹 Actualizar perfil
  actualizarPerfil(): void {
    if (!this.perfilForm.valid) {
      this.mensaje = 'Por favor completa correctamente los campos';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<Usuario>(`${environment.apiUrl}/usuarios/me`, this.perfilForm.value, { headers })
      .subscribe({
        next: (res) => {
          this.usuario = res;
          this.mensaje = 'Perfil actualizado correctamente';
          // Limpiar campo de contraseña
          this.perfilForm.patchValue({ password: '' });
        },
        error: (err) => {
          console.error('Error al actualizar perfil', err);
          this.mensaje = 'Error al actualizar perfil';
        }
      });
  }

}
