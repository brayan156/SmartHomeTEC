import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aposento } from 'src/app/tablas-y-relaciones/aposento';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { DispositivoAdquirido } from 'src/app/tablas-y-relaciones/dispositivoAdquirido';
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

  getMisAposentos() {
    return this.http.get<Aposento[]>(this.Url + "Aposento/aposentoscliente/"  + this.Usuario.id);
  }

  getMisDispositivos() {
    return this.http.get<[]>(this.Url + "Cliente/dispositivosDueno/"  + this.Usuario.id);
  }

  putDispositivoAdquirido(dispositivoAdquirido: DispositivoAdquirido) {
    return this.http.put(this.Url + "Cliente/DispositivoAdquirido/"  + this.Usuario.id, dispositivoAdquirido);
  }

  addAposento(nuevoNombre: string) {
    
  }

}
