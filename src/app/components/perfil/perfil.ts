import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { ActualizarPerfilDTO } from '../../models/actualizarperfil.dto';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class PerfilComponent implements OnInit {

  usuario!: Usuario;
  perfilForm: FormGroup;
  mensaje = '';

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (user: Usuario) => {
        this.usuario = user;
        this.perfilForm.patchValue({
          nombre: user.nombre || '',
          email: user.email || ''
        });
      },
      error: (err: any) => {
        console.error('Error al obtener perfil', err);
      }
    });
  }

  passwordsMatch(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    if (newPass && confirmPass && newPass !== confirmPass) {
      return { passwordMismatch: true };
    }
    return null;
  }

  actualizarPerfil(): void {
    if (!this.perfilForm.valid) {
      this.mensaje = 'Por favor completa correctamente los campos';
      return;
    }

    // 🔹 Crear DTO con datos a enviar
    const dto: ActualizarPerfilDTO = {
      nombre: this.perfilForm.value.nombre,
      email: this.perfilForm.value.email
    };

    // 🔹 Solo agregar contraseña si el usuario quiere cambiarla
    if (this.perfilForm.value.newPassword) {
      if (!this.perfilForm.value.currentPassword) {
        this.mensaje = 'Debes ingresar tu contraseña actual para cambiarla';
        return;
      }
      dto.currentPassword = this.perfilForm.value.currentPassword;
      dto.newPassword = this.perfilForm.value.newPassword;
    }

    // 🔹 Depuración: mostrar DTO antes de enviarlo
    console.log('DTO a enviar:', dto);

    // 🔹 Llamada al service
    this.usuarioService.actualizarPerfil(dto).subscribe({
      next: (user: Usuario) => {
        this.usuario = user;
        this.mensaje = 'Perfil actualizado correctamente';
        this.perfilForm.patchValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
      },
      error: (err: any) => {
        console.error('Error al actualizar perfil', err);
        // 🔹 Manejo de errores según status
        if (err.status === 400) {
          this.mensaje = err.error?.message || 'Datos inválidos enviados al servidor';
        } else if (err.status === 403) {
          this.mensaje = 'Contraseña actual incorrecta o no tienes permisos';
        } else if (err.status === 500) {
          this.mensaje = 'Error interno del servidor';
        } else {
          this.mensaje = 'Error al actualizar perfil';
        }
      }
    });
  }

}
