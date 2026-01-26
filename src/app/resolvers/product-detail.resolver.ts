import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductoService } from '../services/producto.service';


export const productDetailResolver: ResolveFn<any> = (route) => {
  const service = inject(ProductoService);
  const id = Number(route.paramMap.get('id'));
  return service.getById(id);
};
