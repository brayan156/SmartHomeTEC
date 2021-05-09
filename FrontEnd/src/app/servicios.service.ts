import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Administrador} from './Comunicacion/administrador';
import {Aposento} from './Comunicacion/aposento';
import {CertificadoGarantia} from './Comunicacion/certificado-garantia';
import {Cliente} from './Comunicacion/cliente';
import {ClienteHaUsado} from './Comunicacion/cliente-ha-usado';
import {DispositivoAdquirido} from './Comunicacion/dispositivo-adquirido';
import {DispositivoModelo} from './Comunicacion/dispositivo-modelo';
import {DispositivoSeVendeEn} from './Comunicacion/dispositivo-se-vende-en';
import {Distribuidor} from './Comunicacion/distribuidor';
import {Factura} from './Comunicacion/factura';
import {Historial} from './Comunicacion/historial';
import {Pedido} from './Comunicacion/pedido';
import {PedidoFactura} from './Comunicacion/pedido-factura';
import {Tipo} from './Comunicacion/tipo';
import {BehaviorSubject, Observable} from 'rxjs';
import {ClienteEntregaEn} from './Comunicacion/cliente-entrega-en';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  Url = 'https://localhost:44341/api/';
  private valores = new BehaviorSubject('');
  public valoresActuales = this.valores.asObservable();
  constructor(private http: HttpClient) { }
  // tslint:disable-next-line:new-parens
  public administrador: Administrador = new Administrador;
  // tslint:disable-next-line:new-parens
  public cliente: Cliente = new Cliente;

  // tslint:disable-next-line:typedef
  public obtenerDispositivosModelo() {
    return this.http.get<DispositivoModelo[]>(this.Url + 'DispositivoModelo');
  }
  // tslint:disable-next-line:typedef
  public crearDispositivoModelo(disposivoModelo: DispositivoModelo){
    return this.http.post(this.Url + 'DispositivoModelo/crear', disposivoModelo);
  }
  // tslint:disable-next-line:typedef
  public eliminarDispositivosModelo(id: string){
    return this.http.delete(this.Url + 'DispositivoModelo/' + id);
  }
  // tslint:disable-next-line:typedef
  public editarDipositivoModelo(id: string, dispositivoModelo: DispositivoModelo){
    return this.http.put(this.Url + 'DispositivoModelo/' + id, dispositivoModelo);
  }
  // tslint:disable-next-line:typedef
  public crearCliente(cliente: Cliente){
    return this.http.post(this.Url + 'Cliente', cliente);
  }

  // tslint:disable-next-line:typedef
  public editarCliente(id: number, cliente: Cliente){
    return this.http.put(this.Url + 'Cliente/' + id, cliente);
  }

  public getdispositvosasociados(): Observable<number>{
    return this.http.get<number>(this.Url + ' Dashboard/dispositivos_asociados');
  }

  // tslint:disable-next-line:typedef
  public obtenerDistribuidores(){
    return this.http.get<Distribuidor[]>(this.Url + 'Distribuidor');
  }
  // tslint:disable-next-line:typedef
  public editarDistribuidores(id: number , distribudor: Distribuidor){
    return this.http.put(this.Url + 'Distribuidor/' + id, distribudor);
  }

  // tslint:disable-next-line:typedef
  public crearDistribuidord(distribudor: Distribuidor){
    return this.http.post(this.Url + 'Distribuidor', distribudor);
  }
  // tslint:disable-next-line:typedef
  public eliminarDistribuidor(id: number){
    return this.http.delete(this.Url + 'Distribuidor/' + id);
  }


  // tslint:disable-next-line:typedef
  public ValidarLogin(correo: string, contrasena: string) {
    return this.http.get<Administrador[]>(this.Url + 'Administrador/validar/' + contrasena + '/' + correo);
  }

  // tslint:disable-next-line:typedef
  public validarLogin2(correo: string, contrasena: string){
    return this.http.get<Cliente[]>(this.Url + 'Cliente/Cliente/' + contrasena + '/' + correo);
  }

  // tslint:disable-next-line:typedef
  public crearDirrecionEntrega(direcionEntrega: ClienteEntregaEn){
    return this.http.post(this.Url + 'DireccionEntrega', direcionEntrega);
  }

  // tslint:disable-next-line:typedef
  public leerDirrecionEntrega(id: number){
    return this.http.get<ClienteEntregaEn[]>(this.Url + 'DireccionEntrega/' + id);
  }
  // tslint:disable-next-line:typedef
  public obtenerTiendaLinea(pais: string){
    // tslint:disable-next-line:max-line-length
    return this.http.get<{dispositivoSeVendeEn: DispositivoSeVendeEn , dispositivoModelo: DispositivoModelo}[]>(this.Url + 'DispositivoModelo/region/' + pais);
  }


}

