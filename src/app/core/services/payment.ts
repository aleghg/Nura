import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private API = 'http://localhost:8080/payments';

  constructor(private http: HttpClient) {}

  crearPreferencia(items: any[]) {
    return this.http.post<any>(`${this.API}/create`, { items });
  }
}
