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
import { DbAPIService } from '../API/db-api.service';
import { Aposento } from 'src/app/tablas-y-relaciones/aposento';
import { CertificadoDeGarantia } from 'src/app/tablas-y-relaciones/certificado_garantia';
import { DispositivoAdquirido } from 'src/app/tablas-y-relaciones/dispositivoAdquirido';
import { Dispositivomodelo } from 'src/app/tablas-y-relaciones/Dispositivomodelo';
import { Factura } from 'src/app/tablas-y-relaciones/factura';
import { Historial } from 'src/app/tablas-y-relaciones/historial';
import { Pedido } from 'src/app/tablas-y-relaciones/pedido';
import { PedidoFactura } from 'src/app/tablas-y-relaciones/pedidoFactura';
import { tipo } from 'src/app/tablas-y-relaciones/tipo';

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
    private tiposService: tipoService,
  private dbAPI: DbAPIService) {
    
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

  SincronizarTodo() {
    let objeto = {
      historiales: this.historiales,
      clienteHaUsado: this.clientesHanUsado,
      dispositivos: this.dispositivosAdquiridos,
      aposentos: this.aposentos
    }
    return this.http.post(this.dbAPI.Url + "Cliente/sincronizar/" + this.dbAPI.Usuario.id, objeto);
  }

  SincronizarConApi() {
    return this.http.get<any>(this.dbAPI.Url + "Cliente/desincronizar");
  }

  SincronizarTodoConApi() {
    this.SincronizarConApi().subscribe(data => {
      console.log("estoy populando datos....")
      
      let clientesEntrantes: Cliente[] = data.clientes;
      clientesEntrantes.forEach(entro => {
        this.database.executeSql('insert into Cliente (id, email, contrasena, primer_apellido, segundo_apellido, nombre, pais) VALUES (?,?,?,?,?,?,?)',
          [entro.id, entro.email, entro.contrasena, entro.primerApellido, entro.segundoApellido, entro.nombre, entro.pais]).then(data2 => {
            this.clientService.loadClientes(this.database, this.clientes);
            console.log("estoy populando datos....", entro.email);
        })
      })

      let aposentosEntrantes: Aposento[] = data.aposentos;
      aposentosEntrantes.forEach(entro => {
        this.database.executeSql('insert into Aposento (id, nombre_cuarto, id_cliente) values (?,?,?)',
          [entro.id, entro.nombreCuarto, entro.idCliente]).then(data2 => {
            this.aposentosService.loadAposentos(this.database, this.aposentos);
        })
      })

      let certificadosEntrantes: CertificadoDeGarantia[] = data.certificados;
      certificadosEntrantes.forEach(entro => {
        this.database.executeSql('insert into  Certificado_garantia (n_factura, mes_fin_garantia, ano_fin_garantia) VALUES (?,?,?)',
          [entro.nFactura, entro.mesFinGarantia, entro.anoFinGarantia]).then(data2 => {
            this.garantiaService.loadGarantias(this.database, this.garantias);

        })
      })

      let clientesHanUsadoEntran: ClienteHaUsado[] = data.clientesHanUsado;
      clientesHanUsadoEntran.forEach(entro => {
        this.database.executeSql('insert into Cliente_ha_usado (n_serie_dispositivo, id_cliente,propietario_actual) VALUES (?,?,?)',
          [entro.nSerieDispositivo, entro.idCliente, entro.propietarioActual]).then(data2 => {
            this.dispositivoService.loadClienteHaUsado(this.database, this.clientesHanUsado);
        })
      })

      let dipositivoAdquiridosEntran: DispositivoAdquirido[] = data.dipositivoAdquiridos;
      dipositivoAdquiridosEntran.forEach(entro => {
        this.database.executeSql('insert into Dispositivo_adquirido (n_serie, prendido, fecha_prendido, modelo, id_aposento) VALUES (?,?,?,?,?)',
          [entro.nSerie, entro.prendido, entro.fechaprendido, entro.modelo, entro.idAposento]).then(data2 => {
            this.dispositivoService.loadDispositivosAdquiridos(this.database, this.dispositivosAdquiridos);
        })
      })

      let dispositivoModelosEntran: Dispositivomodelo[] = data.dispositivoModelos;
      dispositivoModelosEntran.forEach(entro => {
        this.database.executeSql('insert into Dispositivo_modelo (modelo, marca, imagen, consumo_electrico, tipo) values  (?,?,?,?,?)',
          [entro.modelo, entro.marca, entro.imagen, entro.consumoElectrico, entro.tipo]).then(data2 => {
            this.dispositivoService.loadDispositivosmodelo(this.database, this.dispositivosmodelo);
            console.log("estoy populando datos....", entro.marca);

        })
      })

      let facturasEntran: Factura[] = data.facturas;
      facturasEntran.forEach(entro => {
        this.database.executeSql('insert into Factura (n_factura, dia, mes, ano) values (?,?,?,?)',
          [entro.nFactura, entro.dia, entro.mes, entro.ano]).then(data2 => {
            this.facturaService.loadFacturas(this.database, this.facturas);
        })
      })


      let historialesEntran: Historial[] = data.historiales;
      historialesEntran.forEach(entro => {
        this.database.executeSql('insert into Historial (n_historial, n_serie, dia, mes, ano, hora, minutos_de_uso) VALUES  (?,?,?,?,?,?)',
          [entro.nHistorial, entro.nSerie, entro.dia, entro.mes, entro.ano, entro.hora, entro.minutosDeUso]).then(data2 => {
            this.historialService.loadHistoriales(this.database, this.historiales);
        })
      })


      let pedidosEntran: Pedido[] = data.pedidos;
      pedidosEntran.forEach(entro => {
        this.database.executeSql('insert into Pedido (id, monto, id_cliente, n_serie_dispositivo) VALUES  (?,?,?,?)',
          [entro.Id, entro.Monto, entro.idCliente, entro.nSerieDispositivo]).then(data2 => {
            this.pedidoService.loadPedidos(this.database, this.pedidos);
        })
      })

      let pedidosFacturasEntran: PedidoFactura[] = data.pedidosFacturas;
      pedidosFacturasEntran .forEach(entro => {
        this.database.executeSql('insert into Pedido_Factura (id_pedido, n_factura) VALUES (?,?)',
          [entro.IdPedido, entro.nFactura]).then(data2 => {
            this.pedidoService.loadPedidosFactura(this.database, this.pedidosFactura);
        })
      })

      let tiposEntran: tipo[] = data.tipos;
      tiposEntran .forEach(entro => {
        this.database.executeSql('insert into Tipo (nombre, tiempo_de_garantia, imagen, descripcion) VALUES (?,?,?,?)',
          [entro.nombre, entro.tiempoDeGarantia, entro.imagen, entro.descripcion]).then(data2 => {
            this.tiposService.loadtipos(this.database, this.tipos);
        })
      })

      
    })
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


