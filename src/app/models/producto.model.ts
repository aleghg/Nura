import { Categoria } from "./categoria.model";

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo: boolean;
  categoria: Categoria;  
  imagenBase64?: string; 
}