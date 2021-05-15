import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteAPIService {
  Url = 'https://localhost:44341/api/';
  constructor(private http: HttpClient ) { }

  validarCliente(correo:string, password:string) {
    return this.http.get<Cliente[]>(this.Url + "Cliente/Cliente/"  + password  + "/"+ correo);
  }
}
