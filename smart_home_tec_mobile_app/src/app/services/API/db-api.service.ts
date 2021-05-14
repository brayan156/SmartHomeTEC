import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aposento } from 'src/app/tablas-y-relaciones/aposento';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { DispositivoAdquirido } from 'src/app/tablas-y-relaciones/dispositivoAdquirido';
import { Dispositivomodelo } from 'src/app/tablas-y-relaciones/Dispositivomodelo';
import { tipo } from 'src/app/tablas-y-relaciones/tipo';
import { ClienteAPIService } from './cliente-api.service';

@Injectable({
  providedIn: 'root'
})
export class DbAPIService {

  Url = 'https://192.168.1.2:45455/api/';
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


  putDispositivoAdquirido(dispositivoAdquirido:DispositivoAdquirido) {
    return this.http.put(this.Url + "DispositivoAdquirido/"  + dispositivoAdquirido.nSerie, dispositivoAdquirido, {responseType: "text"});
  }

  addAposento(nuevoNombre: string) {
    console.log("el nuevoNombre ", nuevoNombre);
    let aposento = new Aposento();
    aposento.nombreCuarto = nuevoNombre;
    aposento.idCliente = this.Usuario.id;
    return this.http.post(this.Url + "Aposento", aposento, {responseType: "text"});
  }

  prenderDispositivo(n_serie: number) {
    return this.http.get(this.Url + "DispositivoAdquirido/encender/" + n_serie);
  }

  apagarDispositivo(n_serie) {
    return this.http.get(this.Url + "DispositivoAdquirido/apagar/" + n_serie);
  }

  asociarDispositivoANuevoCliente(n_serie:number, idNuevoCliente: number) {
    return this.http.get(this.Url + "ClienteHaUsado/transferir/" + this.Usuario.id + "/" + idNuevoCliente + "/" + n_serie, {responseType:"text"});
  }

  getDispositivosModelo() {
    return this.http.get<Dispositivomodelo[]>(this.Url + "DispositivoModelo");
  }

  getTipos() {
    return this.http.get<tipo[]>(this.Url + "Tipo");
  }

  nuevoDispositivo(objeto: object) {
    return this.http.post(this.Url + 'ClienteHaUsado/agregardispositivo/' + this.Usuario.id, objeto, {responseType: "text"});
  }

  deleteAposento(idAposento: number) {
    return this.http.delete(this.Url + 'Aposento/' + idAposento + "/" + this.Usuario.id, {responseType:"text"});
  }

  putAposento(aposento: Aposento) {
    return this.http.put(this.Url + "Aposento/" + aposento.id, aposento);
  }

  getMisDispositivosPorAposento(aposentoID: number) {
    return this.http.get<[]>(this.Url + "Aposento/dispositivos/" + aposentoID);
  }

  getDispositivoAdquirido(n_serie: number) {
    return this.http.get<DispositivoAdquirido>(this.Url + "DispositivoAdquirido/" + n_serie);
  }

}
