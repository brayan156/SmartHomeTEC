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
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  Url = 'https://localhost:44341/api/';
  private valores = new BehaviorSubject('');
  public valoresActuales = this.valores.asObservable();
  constructor(private http: HttpClient) { }
  public administrador: Administrador;
  public cliente: Cliente;

  // tslint:disable-next-line:typedef
  public obtenerDispositivosModelo() {
    return this.http.get<DispositivoModelo[]>(this.Url + 'DispositivoModelo');
  }
  // tslint:disable-next-line:typedef
  public crearDispositivosModelo(dispositivoModelo: DispositivoModelo) {
    return this.http.post(this.Url + 'DispositivoModelo', dispositivoModelo);
  }

  // tslint:disable-next-line:typedef
  public editarDispositivosModelo(dispositivoModelo: DispositivoModelo){
    return this.http.put(this.Url + 'algo', dispositivoModelo);
  }
  // tslint:disable-next-line:typedef
  public eliminarDispositivosModelo(id: number){
    return this.http.delete(this.Url + 'algo' + id);
  }


  // tslint:disable-next-line:typedef
  public obtenerTipoDispositivo(){
    return this.http.get(this.Url + 'algo');
  }
  // tslint:disable-next-line:typedef
  public crearTipoDispositivo(tipoDispositivo: Tipo){
    return this.http.put(this.Url + 'algo', tipoDispositivo);
  }

  // tslint:disable-next-line:typedef
  public editarTipoDispositivo(tipoDispositivo: Tipo){
    return this.http.put(this.Url + 'algo', tipoDispositivo);
  }
  // tslint:disable-next-line:typedef
  public eliminarTipoDispositivo(id: number){
    return this.http.delete(this.Url + 'algo' + id);
  }


  // tslint:disable-next-line:typedef
  public obtenerDistribuidores(){
    return this.http.get(this.Url + 'algo');
  }
  // tslint:disable-next-line:typedef
  public editarDistribuidores(distribudor: Distribuidor){
    return this.http.put(this.Url + 'algo', distribudor);
  }

  // tslint:disable-next-line:typedef
  public crearDistribuidord(distribudor: Distribuidor){
    return this.http.put(this.Url + 'algo', distribudor);
  }
  // tslint:disable-next-line:typedef
  public eliminarDistribuidor(id: number){
    return this.http.delete(this.Url + 'algo' + id);
  }


  public ValidarLogin(correo: string, contrasena: string) {
    return this.http.get<Administrador[]>(this.Url + 'Administrador/validar/' + contrasena + '/' + correo);
  }

}

