import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { ClienteAPIService } from './cliente-api.service';

@Injectable({
  providedIn: 'root'
})
export class DbAPIService {

  Url = 'https://localhost:44341/api/';
  Usuario: Cliente;


  constructor(private http: HttpClient) {
    this.Usuario = new Cliente();
  }

  validarCliente(correo:string, password:string) {
    return this.http.get<Cliente[]>(this.Url + "Cliente/Cliente/"  + password  + "/"+ correo);
  }
}
