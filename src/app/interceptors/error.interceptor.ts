import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let mensaje = 'Error desconocido';

        if (err.error?.mensaje) {
          mensaje = err.error.mensaje;
        } else if (err.status === 0) {
          mensaje = 'No se pudo conectar con el servidor';
        }

        Swal.fire({
          title: 'Error',
          text: mensaje,
          icon: 'error',
          confirmButtonColor: '#C6A97E'
        });

        if (err.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }

        return throwError(() => err);
      })
    );
  }
}
