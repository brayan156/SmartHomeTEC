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


  /**\
   * Constructor de los servicios
   * @param http libreria para comunicarse con el puesto de la base de datos
   * @param cookieService liberia para guardar datos en caso de refrecj
   */
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  // tslint:disable-next-line:new-parens

  // tslint:disable-next-line:new-parens
  public administrador: Administrador = new Administrador;
  // tslint:disable-next-line:new-parens
  public cliente: Cliente = new Cliente;

  /**
   * Funcion para obtener la lista de dispositivos modelos detnro de la base de datos
   *
   */
  // tslint:disable-next-line:typedef
  public obtenerDispositivosModelo() {
    return this.http.get<DispositivoModelo[]>(this.Url + 'DispositivoModelo');
  }

  /**
   * Obtiene el cliente segun el id o cedula  de este
   */
  // tslint:disable-next-line:typedef
  public  getCliente(){
    const idA = (this.cookieService.get('cedula'));
    return this.http.get<Cliente>(this.Url + 'Cliente/' + idA);
  }

  /**
   * Obtiene la lista de todos los clientes en la base de datos
   */
  // tslint:disable-next-line:typedef
  public getListaCliente(){
    return this.http.get<Cliente[]>(this.Url + 'Cliente');
  }

  /**
   * Crea un nuevo dispositivo en la base de datos
   * @param disposivoModelo objero que se envia a la base de datos para crear un dispositico Modelo en ella
   */
  // tslint:disable-next-line:typedef
  public crearDispositivoModelo(disposivoModelo: DispositivoModelo){
    return this.http.post(this.Url + 'DispositivoModelo/crear', disposivoModelo);
  }

  /**
   * Eliminia un dispositivo Modelo dentro de la base de datos
   * @param id el id del dispositivo modelo a eliminar
   */
  // tslint:disable-next-line:typedef
  public eliminarDispositivosModelo(id: string){
    return this.http.delete(this.Url + 'DispositivoModelo/' + id);
  }

  /**
   * Edita el un dispositivo especifico dentro de la base de datos
   * @param id del dispositivo a editar
   * @param dispositivoModelo nuevos valores a editar del dispositivo modelo
   */
  // tslint:disable-next-line:typedef
  public editarDipositivoModelo(id: string, dispositivoModelo: DispositivoModelo){
    return this.http.put(this.Url + 'DispositivoModelo/' + id, dispositivoModelo);
  }

  /**
   * Crea un nuevo cliente dentro de la base de datos
   * @param cliente objeto a guardar en la base de datos
   */
  // tslint:disable-next-line:typedef
  public crearCliente(cliente: Cliente){
    // tslint:disable-next-line:ban-types
    return this.http.post<String>(this.Url + 'Cliente', cliente);
  }

  /**
   * Edita los valores del cliente dentro de la base de datos
   * @param id del cliente
   * @param cliente objeto al cual se le van a cambiar los datos
   */

  // tslint:disable-next-line:typedef
  public editarCliente(id: number, cliente: Cliente){
    return this.http.put(this.Url  + 'Cliente/' + id, cliente);
  }

  /**
   * Obtiente una lista de los dispositivos asociados
   */
  public getdispositvosasociados(): Observable<number>{
    return this.http.get<number>(this.Url + 'Dashboard/dispositivos_asociados');
  }

  /**
   * Obtiene una lista de los dispositivos por region de la base de datos
   */
  // tslint:disable-next-line:typedef
  public getDispositivoRegion(){
    return this.http.get<{pais: string , cantidad: number}[]>(this.Url + 'Dashboard/dispositivos_region');
  }

  /**
   * Obtiene el promedio de dispositivos asociados en la base de datos
   */

  // tslint:disable-next-line:typedef
  public getDispositivoPromedio(){
    return this.http.get<number>(this.Url + 'Dashboard/dispositivos_promedio');
  }

  /**
   * Cantidad total de dispositivos registrados
   */
  // tslint:disable-next-line:typedef
  public getDispositiviosRegistrados(){
    // tslint:disable-next-line:ban-types
    return this.http.get<{dispositivoAdquirido: DispositivoAdquirido, dueno: string}[]>(this.Url + 'Dashboard/dispositivos');
  }

  /**
   * Obtiene la lista de distribuidores dentro de la base de datos
   */
  // tslint:disable-next-line:typedef
  public obtenerDistribuidores(){
    return this.http.get<Distribuidor[]>(this.Url + 'Distribuidor');
  }

  /**
   * Edita un distribuidor en la base de datos
   * @param id del distribuidor que se desea editar
   * @param distribudor objeto con los datos que desea editar
   */
  // tslint:disable-next-line:typedef
  public editarDistribuidores(id: number , distribudor: Distribuidor){
    return this.http.put(this.Url + 'Distribuidor/' + id, distribudor);
  }

  /**
   * Crea un nuevo distribuidor en la base de datos
   * @param distribudor obejto con el cual se va a crear el distribuidor en la base de datos
   */
  // tslint:disable-next-line:typedef
  public crearDistribuidord(distribudor: Distribuidor){
    return this.http.post(this.Url + 'Distribuidor', distribudor);
  }

  /**
   * Elimina un distribuidor
   * @param id del distribuidor a eliminar en la base de datos
   */
  // tslint:disable-next-line:typedef
  public eliminarDistribuidor(id: number){
    return this.http.delete(this.Url + 'Distribuidor/' + id);
  }

  /**
   * obtiene un distribuidor en la base de datos
   * @param id del ditribuidor
   */
  // tslint:disable-next-line:typedef
  public getDistribuidor(id: number){
    return this.http.get<Distribuidor>(this.Url + 'Distribuidor/' + id);
  }

  /**
   * Obtiene la lista de tipos de dispositivos
   */
  // tslint:disable-next-line:typedef
  public getTiposDispositivos(){
    return this.http.get<Tipo[]>(this.Url + 'Tipo');
  }

  /**
   * Crea un nuevo tipo de dispositivo
   * @param tipo tipo de dispositivo creado
   */
  // tslint:disable-next-line:typedef
  public crearTipoDispositivo(tipo: Tipo){
    return this.http.post(this.Url + 'Tipo', tipo);
  }

  /**
   * Edita el tipo de dispositivo
   * @param id del tipo a editar
   * @param tipo tipo de dispositvo editador
   */
  // tslint:disable-next-line:typedef
  public editarTipoDispositivo(id: string, tipo: Tipo){
    return this.http.put(this.Url + 'Tipo/' + id , tipo);
  }

  /**
   * Eliminar un tipo de dispositivo especifico en la base de datos la cual lo eliminara por medio del id
   * @param id id con la cual la base da datos sabra cual dispositivo eliminar
   */
  // tslint:disable-next-line:typedef
  public eliminarTipoDispositivo(id: string){
    return this.http.delete(this.Url + 'Tipo/' + id );
  }

  /**
   * Obtiene un tipo de dispositivo dentro de la base de datps
   * @param id del dispositivo
   */

  // tslint:disable-next-line:typedef
  public getTipo(id: string){
    return this.http.get<Tipo>(this.Url + 'Tipo/' + id);
  }

  /**
   * Valida el login de las funciones del correo electronico
   * @param correo correo del administrador para validar si existe en la base de datos
   * @param contrasena contrasena del administrador para valir que sea correcta y se encuentre en la base de datos
   */
  // tslint:disable-next-line:typedef
  public ValidarLogin(correo: string, contrasena: string) {
    return this.http.get<Administrador[]>(this.Url + 'Administrador/validar/' + contrasena + '/' + correo);
  }


  /**
   * Validar el login de los usuario
   * @param correo revisa si es un correo electronico valido dentro de la base de datos
   * @param contrasena revisa si es la contrasena valida dentro de la base de datos
   */
  // tslint:disable-next-line:typedef
  public validarLogin2(correo: string, contrasena: string){
    return this.http.get<Cliente[]>(this.Url + 'Cliente/Cliente/' + contrasena + '/' + correo);
  }

  /**
   *
   * @param direcionEntrega
   */
  // tslint:disable-next-line:typedef
  public crearDirrecionEntrega(direcionEntrega: ClienteEntregaEn){
    return this.http.post(this.Url + 'DireccionEntrega', direcionEntrega);
  }

  /**
   * Obtiene las dirreciones de entrega dentro de la base de datos
   * @param id del usuario del cual se desea obtener sus dirreciones de entrega
   */
  // tslint:disable-next-line:typedef
  public leerDirrecionEntrega(id: number){
    return this.http.get<ClienteEntregaEn[]>(this.Url + 'DireccionEntrega/' + id);
  }

  /**
   * Obtiene los datos de la tienda en linea seguna la region en la cual se
   * @param pais region para controlar la regiones donde se vende el dispositivo
   */
  // tslint:disable-next-line:typedef
  public obtenerTiendaLinea(pais: string){
    // tslint:disable-next-line:max-line-length
    return this.http.get<{dispositivoSeVendeEn: DispositivoSeVendeEn , dispositivoModelo: DispositivoModelo}[]>(this.Url + 'DispositivoModelo/region/' + pais);
  }

  /**
   * Otiene la informacion para realizar los reportes mensuales
   * @param id id del usuario que desea pedir el reporte
   * @param ano ano en el cual el usuario desea perdir el reporte
   * @param mes en el cual el usuario desea pedir el reporte
   */
  // tslint:disable-next-line:typedef
  public getReporteMes(id: number , ano: number , mes: number){
    return this.http.get<{consumo: number , datos: Datos}[]>(this.Url + 'Reportes/consumo_mensual/' + id + '/' + ano + '/' + mes);
  }

  /**
   * Reporte de una fecha inicial a una fecha final
   * @param id id del cliente
   * @param di dia de inico
   * @param mi mes de inicio
   * @param ai ano de inicio
   * @param df dia final
   * @param mf mes final
   * @param af ano final
   */
  // tslint:disable-next-line:typedef
  public getReporteDias(id: number, di: number, mi: number, ai: number, df: number, mf: number , af: number){
    // tslint:disable-next-line:max-line-length
    return this.http.get<{hora: Hora, promedio_dispositivos: number, cantidadTotalMinutos: number}[]>(this.Url + 'Reportes/consumo_periodo_dia/' + id + '/' + di + '/' + mi + '/' +  ai + '/' + df + '/' + mf +
      '/' + af);
  }

  /**
   * Funcio para obtener el consumo por tipo
   * @param id del cliente
   */
  // tslint:disable-next-line:typedef
  public getConsumoTipo(id: number){
    return this.http.get<{tipo: string, uso: number} []>(this.Url + 'Reportes/consumo_tipo/' + id);
  }

  /**
   * Crear los aposentos por defecto cuando se crea un cliente
   * @param id del nuevo cliente
   */
  // tslint:disable-next-line:typedef
  public habilitarAposentos(id: number) {
    console.log(id);
    return this.http.get(this.Url + 'Aposento/Default/'+id);
  }

  /**
   * Obtiene el tipo de reporte
   */
  // tslint:disable-next-line:typedef
  public obtenereportetipo() {
    return this.http.get<{tipo: string, uso: number} [] > (this.Url + 'Reportes/consumo_tipo/' + this.cliente.id);
  }

  /**
   * Obtener pdf del tipo reporte
   * @param reporte reporte
   * @param reporte reporte
   * @param nombre nombre del reporte segun el cliente que lo solicita
   * @param primerApellido primer apellido del reporte segun el cliente
   * @param segundoApellido segundo apellido del cliente que solicita el reporte
   */
  // tslint:disable-next-line:typedef
  public obtenerPDFreportetipo(reporte, nombre: string , primerApellido: string , segundoApellido: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.Url + 'Pdf/consumo_tipo/' + nombre + '/' + primerApellido + '/' + segundoApellido, reporte, { responseType: 'blob' });
  }

  /**
   * Reporte mensual de consumo
   * @param reporte reporte
   * @param nombre nombre del reporte segun el cliente que lo solicita
   * @param primerApellido primer apellido del reporte segun el cliente
   * @param segundoApellido segundo apellido del cliente que solicita el reporte
   */
  // tslint:disable-next-line:typedef
  public obtenerPDFMensual(reporte, nombre: string , primerApellido: string , segundoApellido: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.Url + 'Pdf/consumo_mensual/' + nombre + '/' + primerApellido + '/' + segundoApellido, reporte, { responseType: 'blob' });
  }

  /**
   * Obtiene el reporte por dias
   * @param reporte reporte
   * @param nombre nombre del usuario
   * @param primerApellido primer apellido del usuario
   * @param segundoApellido segundo apellido del usuario
   */
  // tslint:disable-next-line:typedef
  public obtenerPDFDia(reporte, nombre: string , primerApellido: string , segundoApellido: string ) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.Url + 'Pdf/consumo_periodo_dia/' + nombre + '/' + primerApellido + '/' + segundoApellido, reporte, { responseType: 'blob' });
  }

  /**
   * Funcion para obtener todas la regiones dentro de la base de datos
   */
  // tslint:disable-next-line:typedef
  public getRegiones(){
    return this.http.get<Regiones[]>(this.Url + 'Regiones');
  }

  /**
   * Funcion para comprar un dispositivo
   * @param dsv dsv
   * @param idcliente id del cliente que compra el dispositivo
   */
  public comprar(dsv: DispositivoSeVendeEn, idcliente: number) {
    return this.http.post<{ pedido: Pedido, factura: Factura, certificado: CertificadoGarantia }>(this.Url + 'DispositivoSeVendeEn/comprar/' + idcliente, dsv);
  }

  /**
   * Gaurda los datos del excel
   * @param datos datos del excel
   */
  public guardardatosexcel(datos: DispositivoSeVendeEn[]) {
    return this.http.post(this.Url + 'DispositivoSeVendeEn/excel', datos);
  }

  /**
   * obtiene la clase dispositvo se vende de la base de datos
   */
  // tslint:disable-next-line:typedef
  public getDispositivosSeVende(){
    return this.http.get<DispositivoSeVendeEn[]>(this.Url + 'DispositivoSeVendeEn');
  }

}

