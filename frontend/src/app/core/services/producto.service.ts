import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  icono: string;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<{ ok: boolean; productos: Producto[] }> {
    return this.http.get<{ ok: boolean; productos: Producto[] }>(this.url);
  }
}
