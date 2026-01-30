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
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  showPassword = false;

  // 🔴 ERRORES BACKEND
  errores: { [key: string]: string } = {};
  mensajeGeneral: string = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 🔎 Redirigir si ya hay sesión
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/shop']);
      return;
    }

    // Inicializar formulario
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // 🧹 Limpiar errores al escribir
    this.form.valueChanges.subscribe(() => {
      this.errores = {};
      this.mensajeGeneral = '';
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔐 LOGIN
  login(): void {
    
    this.errores = {};
    this.mensajeGeneral = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = {
      email: this.form.get('email')!.value.trim().toLowerCase(),
      password: this.form.get('password')!.value.trim()
    };

    this.auth.login(data).subscribe({
      next: () => {
        // ✅ AuthService ya guarda token y email en localStorage
        Swal.fire({
          title: 'Bienvenid@ ✨',
          text: 'Inicio de sesión exitoso',
          icon: 'success',
          timer: 1600,
          showConfirmButton: false
        });

        this.router.navigateByUrl('/shop');
      },

      error: (err: any) => {
        console.error('ERROR REAL:', err);

        // 🔴 Validaciones backend por campo
        if (err.error?.codigo === 'VALIDACION') {
          this.errores = err.error.errores;
          return;
        }

        // 🔴 Error general
        this.mensajeGeneral =
          typeof err.error?.mensaje === 'string'
            ? err.error.mensaje
            : 'Credenciales incorrectas';

        // Mostrar alerta global
        Swal.fire({
          title: 'Error',
          text: this.mensajeGeneral,
          icon: 'error',
          confirmButtonColor: '#C6A97E'
        });
      }
    });


  }

}
