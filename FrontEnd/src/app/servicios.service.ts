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
import {Datos} from './Comunicacion/datos';
import {Hora} from './Comunicacion/hora';
import {CookieService} from 'ngx-cookie-service';
import {Regiones} from './Comunicacion/regiones';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  Url = 'https://localhost:44341/api/';
  private valores = new BehaviorSubject('');
  public valoresActuales = this.valores.asObservable();



  constructor(private http: HttpClient, private cookieService: CookieService) { }
  // tslint:disable-next-line:new-parens

  public administrador: Administrador = new Administrador;
  // tslint:disable-next-line:new-parens
  public cliente: Cliente = new Cliente;
  // tslint:disable-next-line:typedef
  public obtenerDispositivosModelo() {
    return this.http.get<DispositivoModelo[]>(this.Url + 'DispositivoModelo');
  }
  // tslint:disable-next-line:typedef
  public  getCliente(){
    const idA = (this.cookieService.get('cedula'));
    return this.http.get<Cliente>(this.Url + 'Cliente/' + idA);
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
    return this.http.put(this.Url  +"Cliente/"+ id, cliente);
  }

  public getdispositvosasociados(): Observable<number>{
    return this.http.get<number>(this.Url + 'Dashboard/dispositivos_asociados');
  }

  // tslint:disable-next-line:typedef
  public getDispositivoRegion(){
    return this.http.get<{pais: string , cantidad: number}[]>(this.Url + 'Dashboard/dispositivos_region');
  }
  // tslint:disable-next-line:typedef
  public getDispositivoPromedio(){
    return this.http.get<number>(this.Url + 'Dashboard/dispositivos_promedio');
  }
  // tslint:disable-next-line:typedef
  public getDispositiviosRegistrados(){
    // tslint:disable-next-line:ban-types
    return this.http.get<{dispositivoAdquirido: DispositivoAdquirido, dueno: string}[]>(this.Url + 'Dashboard/dispositivos');
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
  public getTiposDispositivos(){
    return this.http.get<Tipo[]>(this.Url + 'Tipo');
  }
  // tslint:disable-next-line:typedef
  public crearTipoDispositivo(tipo: Tipo){
    return this.http.post(this.Url + 'Tipo', tipo);
  }

  // tslint:disable-next-line:typedef
  public editarTipoDispositivo(id: string, tipo: Tipo){
    return this.http.put(this.Url + 'Tipo/' + id , tipo);
  }

  // tslint:disable-next-line:typedef
  public eliminarTipoDispositivo(id: string){
    return this.http.delete(this.Url + 'Tipo/' + id );
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

  // tslint:disable-next-line:typedef
  public getReporteMes(id: number , ano: number , mes: number){
    return this.http.get<{consumo: number , datos: Datos}[]>(this.Url + 'Reportes/consumo_mensual/' + id + '/' + ano + '/' + mes);
  }

  // tslint:disable-next-line:typedef
  public getReporteDias(id: number, di: number, mi: number, ai: number, df: number, mf: number , af: number){
    // tslint:disable-next-line:max-line-length
    return this.http.get<{hora: Hora, promedio_dispositivos: number, cantidadTotalMinutos: number}[]>(this.Url + 'Reportes/consumo_periodo_dia/' + id + '/' + di + '/' + mi + '/' +  ai + '/' + df + '/' + mf +
      '/' + af);
  }
  // tslint:disable-next-line:typedef
  public getConsumoTipo(id: number){
    return this.http.get<{tipo: string, uso: number} []>(this.Url + 'Reportes/consumo_tipo/' + id);
  }
  // tslint:disable-next-line:typedef
  public habilitarAposentos(id: number) {
    console.log(id)
    return this.http.get(this.Url + 'Aposento/Default/'+id);
  }
  // tslint:disable-next-line:typedef
  public obtenereportetipo() {
    return this.http.get<{tipo: string, uso: number} [] > (this.Url + 'Reportes/consumo_tipo/' + this.cliente.id);
  }

  // tslint:disable-next-line:typedef
  public obtenerPDFreportetipo(reporte) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.Url + 'Pdf/consumo_tipo/' + this.cliente.nombre + '/' + this.cliente.primerApellido + '/' + this.cliente.segundoApellido, reporte, { responseType: 'blob' });
  }

  // tslint:disable-next-line:typedef
  public obtenerPDFMensual(reporte) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.Url + 'Pdf/consumo_mensual/' + this.cliente.nombre + '/' + this.cliente.primerApellido + '/' + this.cliente.segundoApellido, reporte, { responseType: 'blob' });
  }

  // tslint:disable-next-line:typedef
  public obtenerPDFDia(reporte) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.Url + 'Pdf/consumo_periodo_dia/' + this.cliente.nombre + '/' + this.cliente.primerApellido + '/' + this.cliente.segundoApellido, reporte, { responseType: 'blob' });
  }

  // tslint:disable-next-line:typedef
  public getRegiones(){
    return this.http.get<Regiones[]>(this.Url + 'Regiones');
  }

  public comprar(dsv: DispositivoSeVendeEn, idcliente: number) {
    return this.http.post<{ pedido: Pedido, factura: Factura, certificado: CertificadoGarantia }>(this.Url + 'DispositivoSeVendeEn/comprar/' + idcliente, dsv);
  }

  public guardardatosexcel(datos: DispositivoSeVendeEn[]) {
    return this.http.post(this.Url + "DispositivoSeVendeEn/excel", datos);
  }


}

