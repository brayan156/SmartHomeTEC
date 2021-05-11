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
import { TipoService } from './tipo.service';

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
  dispositivosModelo = new BehaviorSubject([]);
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


  constructor(private  sqlite:  SQLite, private plt: Platform, private sqlitePorter: SQLitePorter, private http: HttpClient,
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
  private tiposService: TipoService) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'clientes.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }
 
  seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          // Cargamos todas las tablas
          this.clientService.loadClientes(this.database, this.clientes);
          this.dispositivoService.loadClienteHaUsado(this.database, this.clientesHanUsado);
          this.dispositivoService.loadDispositivosAdquiridos(this.database, this.dispositivosAdquiridos);
          this.dispositivoService.loadDispositivosModelo(this.database, this.dispositivosModelo);
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
          this.tiposService.loadTipos(this.database, this.tipos);

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
    return this.myID.Id;
  }

  existeDispositivo(N_serie:number) {
    this.dispositivoService.existeDispositivo(this.database, this.tmpQuery, N_serie);
    return (this.tmpQuery.value[0] != null) ? true : false;
  }

  fueUsadoDispositivo(N_serie:number) {
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

  addClienteHaUsado(n_serie_dispositivo:number) {
    let data: ClienteHaUsado = new ClienteHaUsado();
    data.IdCliente = this.myID.Id;
    data.NSerieDispositivo = n_serie_dispositivo;
    data.PropietarioActual = true;
    this.dispositivoService.addClienteHaUsado(this.database, data, this.clientesHanUsado);

  }

  updateDispositivoAdquirido(idAposento:number, n_serie:number) {
    this.dispositivoService.updateDispositivoAdquirido(this.database, this.dispositivosAdquiridos, idAposento, n_serie);
  }


  
  validarCliente(email: string, contrasena: string) {
    this.clientService.validateCliente(this.database, this.Usuario, email, contrasena);
    return (this.Usuario.value != null) ? true : false;
  }

  getUsuario() {
    return this.Usuario.value;
  }


  getMisDispositivosModelo() {
    this.dispositivoService.getMisDispositivosModelo(this.database, this.tmpQuery, this.Usuario.value[0]);
    return this.tmpQuery.asObservable();
  }

  // Cambiar estos gets para asociarlos al id del usuario ya que ahora estan retornando la informacion
  // de todos los usuarios.
  getAposentos() {
    this.aposentosService.loadAposentos(this.database, this.aposentos);
    return this.aposentos.value;
  }

  getTipos() {
    this.tiposService.loadTipos(this.database, this.tipos);
    return this.tipos.value;
  }

  getDispositivosModelo() {
    this.dispositivoService.loadDispositivosModelo(this.database, this.dispositivosModelo);
    return this.dispositivosModelo.value;
  }




}


