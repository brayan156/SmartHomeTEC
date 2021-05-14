import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { ClienteServiceService } from './cliente-service.service';
import { DispositivoService } from './dispositivo.service';
import { ClienteHaUsado } from 'src/app/tablas-y-relaciones/cliente_ha_usado';
import { AposentoService } from './aposento.service';
import { GarantiaService } from './garantia.service';
import { DireccionEntregaService } from './direccion-entrega.service';
import { DistribuidorService } from './distribuidor.service';
import { FacturaService } from './factura.service';
import { HistorialService } from './historial.service';
import { PedidoService } from './pedido.service';
import { RegionService } from './region.service';
import { tipoService } from './tipo.service';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private myID: Cliente;
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  clientes = new BehaviorSubject([]);
  productos = new BehaviorSubject([]);
  clientesHanUsado = new BehaviorSubject([]);
  aposentos = new BehaviorSubject([]);
  garantias = new BehaviorSubject([]);
  direcciones = new BehaviorSubject([]);
  dispositivosAdquiridos = new BehaviorSubject([]);
  dispositivosmodelo = new BehaviorSubject([]);
  dispositivoSeVendeEn = new BehaviorSubject([]);
  distribuidores = new BehaviorSubject([]);
  facturas = new BehaviorSubject([]);
  historiales = new BehaviorSubject([]);
  pedidos = new BehaviorSubject([]);
  pedidosFactura = new BehaviorSubject([]);
  regiones = new BehaviorSubject([]);
  tipos = new BehaviorSubject([]);
  tmpQuery = new BehaviorSubject([]);
  Usuario = new BehaviorSubject([]);
  fechaprendido = new BehaviorSubject([]);

  aposentosPorUsuario = new BehaviorSubject([]);
  misDispostivosmodelo = new BehaviorSubject([]);

  Sincronizar = true;


  constructor(private sqlite: SQLite, private plt: Platform, private sqlitePorter: SQLitePorter, private http: HttpClient,
    private clientService: ClienteServiceService,
    private dispositivoService: DispositivoService,
    private aposentosService: AposentoService,
    private garantiaService: GarantiaService,
    private direccionService: DireccionEntregaService,
    private distribuidorService: DistribuidorService,
    private facturaService: FacturaService,
    private historialService: HistorialService,
    private pedidoService: PedidoService,
    private regionesService: RegionService,
    private tiposService: tipoService) {
    
  }

  initSQLite() {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'SmartHomeTEC.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    }); 
  }

  seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            // Cargamos todas las tablas
            this.clientService.loadClientes(this.database, this.clientes);
            this.dispositivoService.loadClienteHaUsado(this.database, this.clientesHanUsado);
            this.dispositivoService.loadDispositivosAdquiridos(this.database, this.dispositivosAdquiridos);
            this.dispositivoService.loadDispositivosmodelo(this.database, this.dispositivosmodelo);
            this.dispositivoService.loadDispositivosSeVendeEn(this.database, this.dispositivoSeVendeEn);
            this.aposentosService.loadAposentos(this.database, this.aposentos);
            this.garantiaService.loadGarantias(this.database, this.garantias);
            this.direccionService.loadDirecciones(this.database, this.direcciones);
            this.distribuidorService.loadDistribuidores(this.database, this.distribuidores);
            this.facturaService.loadFacturas(this.database, this.facturas);
            this.historialService.loadHistoriales(this.database, this.historiales);
            this.pedidoService.loadPedidos(this.database, this.pedidos);
            this.pedidoService.loadPedidosFactura(this.database, this.pedidosFactura);
            this.regionesService.loadRegiones(this.database, this.regiones);
            this.tiposService.loadtipos(this.database, this.tipos);

            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }



  resetMyId() {
    this.myID = new Cliente();
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getClientes(): Observable<Cliente[]> {
    return this.clientes.asObservable();
  }

  getProductos(): Observable<any[]> {
    return this.productos.asObservable();
  }

  getMyID() {
    return this.myID.id;
  }

  existeDispositivo(N_serie: number) {
    this.dispositivoService.existeDispositivo(this.database, this.tmpQuery, N_serie);
    return (this.tmpQuery.value[0] != null) ? true : false;
  }

  fueUsadoDispositivo(N_serie: number) {
    this.dispositivoService.fueUsadoDispositivo(this.database, this.tmpQuery, N_serie);
    return (this.tmpQuery.value[0] != null) ? true : false;
  }

  coincideInformacion(N_serie: number, marca: string, descripcion: string, tipo: string) {
    this.dispositivoService.coincideInformacion(this.database, this.tmpQuery, N_serie);
    let tmp = this.tmpQuery.value;
    let result = false;
    if (marca == tmp[0].marca && descripcion == tmp[0].descripcion && tipo == tmp[0].tipo) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  addClienteHaUsado(n_serie_dispositivo: number) {
    let data: ClienteHaUsado = new ClienteHaUsado();
    data.idCliente = this.Usuario.value[0].id;
    data.nSerieDispositivo = n_serie_dispositivo;
    data.propietarioActual = true;
    this.dispositivoService.addClienteHaUsado(this.database, data, this.clientesHanUsado);

  }


  updateDispositivoAdquirido(idAposento: number, n_serie: number) {
    this.dispositivoService.updateDispositivoAdquirido(this.database, this.dispositivosAdquiridos, idAposento, n_serie);
  }

  addAposento(nuevonombre: string) {
    this.aposentosService.addAposento(this.database, this.aposentos, this.Usuario.value[0], nuevonombre);
  }

  validarCliente(email: string, contrasena: string) {
    this.clientService.validateCliente(this.database, this.Usuario, email, contrasena);
  }

  getUsuario() {
    return this.Usuario.value;
  }

  resetUsuario() {
    this.Usuario = new BehaviorSubject([]);
  }

  apagarDispositivo(N_serie: number) {

    this.dispositivoService.getFechaprendido(this.database, this.fechaprendido, N_serie);

    let fechaprendido = this.fechaprendido.value[0].Fechaprendido;
    let day = new Date(fechaprendido);
    this.historialService.apagarDispositivo(this.database, this.historiales, N_serie, day);


  }

  deleteAposento(aposentoId: number) {
    this.aposentosService.deleteAposento(this.database, this.aposentos, aposentoId);
  }

  updatenombreAposento(aposentoId: number, nuevonombre: string) {
    this.aposentosService.updatenombre(this.database, this.aposentos, aposentoId, nuevonombre);
  }

  prenderDispositivo(N_serie: number) {
    this.historialService.prenderDispositivo(this.database, this.historiales, N_serie);
  }

  getMisDispositivosPorAposento(idAposento: number) {
    this.dispositivoService.getMisDispositivosPorAposento(this.database, this.tmpQuery, this.Usuario.value[0], idAposento);
  }

  getMisDispositivosmodelo() {
    this.dispositivoService.getMisDispositivosmodelo(this.database, this.misDispostivosmodelo, this.Usuario.value[0]);
    console.log("los dispositivos modelo son: ", this.misDispostivosmodelo.value);
    return this.misDispostivosmodelo.value;

  }

  asociarDispositivoANuevoCliente(N_serie: number, data: number) {
    this.dispositivoService.disociarDispositivoDePropietario(this.database, this.clientesHanUsado, N_serie);
    setTimeout(() => {
      this.dispositivoService.asociarDispositivoANuevoPropietario(this.database, this.clientesHanUsado, N_serie, data)
    }, 300)
  }

  getAposentosPorUsuario() {
    this.aposentosService.loadAposentosPorUsuario(this.database, this.aposentosPorUsuario, this.Usuario.value[0]);
    return this.aposentosPorUsuario.value;
  }

  // Cambiar estos gets para asociarlos al id del usuario ya que ahora estan retornando la informacion
  // de todos los usuarios.
  getAposentos() {
    this.aposentosService.loadAposentos(this.database, this.aposentos);
    return this.aposentos.value;
  }

  gettipos() {
    this.tiposService.loadtipos(this.database, this.tipos);
    return this.tipos.value;
  }

  getDispositivosmodelo() {
    this.dispositivoService.loadDispositivosmodelo(this.database, this.dispositivosmodelo);
    return this.dispositivosmodelo.value;
  }




}


