import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  showPassword = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔐 LOGIN
  login(): void {

    if (this.form.invalid) {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Ingresa tu email y contraseña',
        icon: 'warning',
        confirmButtonColor: '#C6A97E'
      });
      return;
    }

    const data = {
      email: this.form.get('email')!.value.trim().toLowerCase(),
      password: this.form.get('password')!.value.trim()
    };

    this.auth.login(data).subscribe({
      next: (res) => {
        // ✅ Guardar sesión
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.email);
        localStorage.setItem('rol', res.rol);

        Swal.fire({
          title: 'Bienvenidos ✨',
          text: 'Inicio de sesión exitoso',
          icon: 'success',
          timer: 1600,
          showConfirmButton: false
        });

        // ✅ Redirigir
        this.router.navigateByUrl('/shop');
      },

      error: (err: any) => {
        const mensaje =
          err?.error?.mensaje ||
          err?.error ||
          'Credenciales incorrectas';

        Swal.fire({
          title: 'Error',
          text: mensaje,
          icon: 'error',
          confirmButtonColor: '#C6A97E'
        });
      }
    });
  }
}
