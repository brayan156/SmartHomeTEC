import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { ClienteHaUsado } from 'src/app/tablas-y-relaciones/cliente_ha_usado';
import { DispositivoAdquirido } from 'src/app/tablas-y-relaciones/dispositivoAdquirido';
import { Dispositivomodelo } from 'src/app/tablas-y-relaciones/Dispositivomodelo';
import { DispositivoSeVendeEn } from 'src/app/tablas-y-relaciones/DispositivoSeVendeEn';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  clientes = new BehaviorSubject([]);

  constructor() { }

  /**
   * Carga los dispositivosAdquirido en la BD local
   * @param database 
   * @param clientes 
   * @returns 
   */
  loadDispositivos(database: SQLiteObject, clientes: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Cliente', []).then(data => {

      let clientesBD: Cliente[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientesBD.push({
            id: data.rows.item(i).ID,
            email: data.rows.item(i).email,
            contrasena: data.rows.item(i).contrasena,
            primerApellido: data.rows.item(i).primerApellido,
            segundoApellido: data.rows.item(i).segundoApellido,
            nombre: data.rows.item(i).nombre,
            pais: data.rows.item(i).Pais,
          });
        }
      }
      clientes.next(clientesBD);
    });
  }

  /**
   * Carga los dispositivosModelo a la BD local
   * @param database 
   * @param coleccion 
   * @returns 
   */
  loadDispositivosmodelo(database: SQLiteObject, coleccion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Dispositivo_modelo', []).then(data => {

      let tmpList: Dispositivomodelo[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            modelo: data.rows.item(i).modelo,
            marca: data.rows.item(i).marca,
            consumoElectrico: data.rows.item(i).consumo_electrico,
            tipo: data.rows.item(i).tipo,
            imagen: data.rows.item(i).imagen,
          });
        }
      }
      coleccion.next(tmpList);
    });
  }

  /**
   * Carga los dispositivosAdquiridos 
   * @param database 
   * @param coleccion 
   * @returns 
   */
  loadDispositivosAdquiridos(database: SQLiteObject, coleccion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Dispositivo_adquirido', []).then(data => {

      let tmpList: DispositivoAdquirido[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            nSerie: data.rows.item(i).n_serie,
            prendido: data.rows.item(i).prendido,
            modelo: data.rows.item(i).modelo,
            idAposento: data.rows.item(i).id_aposento,
            fechaPrendido: data.rows.item(i).fecha_prendido,
          });
        }
      }
      coleccion.next(tmpList);
    });
  }

  /**
   * Carga los dispositivosSeVendeEn en la BD local
   * @param database 
   * @param coleccion 
   * @returns 
   */
  loadDispositivosSeVendeEn(database: SQLiteObject, coleccion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Dispositivo_se_vende_en', []).then(data => {

      let tmpList: DispositivoSeVendeEn[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            cjDistribuidor: data.rows.item(i).cj_distribuidor,
            modeloDispotivo: data.rows.item(i).modelo_dispotivo,
            precio: data.rows.item(i).precio,
            cantidad: data.rows.item(i).cantidad,
          });
        }
      }
      coleccion.next(tmpList);
    });
  }

  /**
   * Carga las filas de ClienteHaUsado a la BD local
   * @param database 
   * @param clientes 
   * @returns 
   */
  loadClienteHaUsado(database: SQLiteObject, clientes: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Cliente_ha_usado', []).then(data => {

      let clientesHanUsadoList: ClienteHaUsado[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientesHanUsadoList.push({
            idCliente: data.rows.item(i).id_cliente,
            nSerieDispositivo: data.rows.item(i).n_serie_dispositivo,
            propietarioActual: data.rows.item(i).propietario_actual
          });
        }
      }
      clientes.next(clientesHanUsadoList);
    });
  }

  /**
   * Pregunta si existe un dispositivo en la BD local
   * @param database 
   * @param tmpQuery 
   * @param N_serie 
   * @returns 
   */
  existeDispositivo(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('SELECT modelo FROM Dispositivo_adquirido WHERE n_serie = ?', [N_serie]).then(data => {
      let modelo = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          modelo.push({
            modelo: data.rows.item(i).modelo
          });
        }
      }
      tmpQuery.next(modelo);
    });
  }

  /**
   * Pregunta si un dispositivo fue usado en la BD local
   * @param database 
   * @param tmpQuery 
   * @param N_serie 
   * @returns 
   */
  fueUsadoDispositivo(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('SELECT id_cliente FROM Cliente_ha_usado WHERE n_serie_dispositivo = ?', [N_serie]).then(data => {
      let clientes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientes.push({
            cliente: data.rows.item(i).id_cliente
          });
        }
      }
      tmpQuery.next(clientes);
    });
  }

  /**
   * Pregunta si la informacion de los parametros coincide en la BD local
   * @param database 
   * @param tmpQuery 
   * @param N_serie 
   * @returns 
   */
  coincideInformacion(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    console.log("entre a coincideInfo");
    return database.executeSql("SELECT n_serie, descripcion, marca, tipo FROM Dispositivo_adquirido JOIN Dispositivo_modelo on Dispositivo_adquirido.modelo = Dispositivo_modelo.modelo JOIN tipo ON Dispositivo_modelo.tipo = tipo.nombre where n_serie = ?", [N_serie]).then(data => {
      let dispositivos = [];
      console.log(data);
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          dispositivos.push({
            n_serie: data.rows.item(i).n_serie,
            descripcion: data.rows.item(i).descripcion,
            marca: data.rows.item(i).marca,
            tipo: data.rows.item(i).tipo
          });
        }
      }
      console.log(data);
      console.log(dispositivos);
      tmpQuery.next(dispositivos);
    });
  }

/**
 * Agrega un clienteHaUsado a la BD local
 * @param database 
 * @param clienteHaUsado 
 * @param clientesHanUsado 
 * @returns 
 */
  addClienteHaUsado(database: SQLiteObject, clienteHaUsado: ClienteHaUsado, clientesHanUsado: BehaviorSubject<any[]>) {
    let data = [clienteHaUsado.nSerieDispositivo, clienteHaUsado.idCliente, 1];
    console.log("estoy ingresando los siguientes datos ", clienteHaUsado.idCliente, clienteHaUsado.nSerieDispositivo, clienteHaUsado.propietarioActual);
    return database.executeSql('INSERT INTO Cliente_ha_usado (n_serie_dispositivo, id_cliente, propietario_actual) VALUES (?, ?, ?)', data).then(data => {
      this.loadClienteHaUsado(database, clientesHanUsado);
    });
  }

  /**
   * Actualiza el aposento de un dispositivoAdquirido en la BD local
   * @param database 
   * @param dispositivosAdquiridos 
   * @param idAposento 
   * @param n_serie 
   * @returns 
   */
  updateDispositivoAdquirido(database: SQLiteObject, dispositivosAdquiridos: BehaviorSubject<any[]>, idAposento: number, n_serie: number) {
    console.log("estoy actualizando los siguientes datos ", idAposento, n_serie);
    return database.executeSql('UPDATE Dispositivo_adquirido SET id_aposento = ? WHERE n_serie = ?', [idAposento, n_serie]).then(data => {
      this.loadDispositivosAdquiridos(database, dispositivosAdquiridos);
    });
  }

  /**
   * Retorna los dispositivos por aposento de la Bd local
   * @param database 
   * @param tmpQuery 
   * @param cliente 
   * @param idAposento 
   * @returns 
   */
  getMisDispositivosPorAposento(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, cliente: Cliente, idAposento: number) {
    return database.executeSql('select mes_fin_garantia, ano_fin_garantia, n_serie, prendido, tipo, imagen from Aposento join Dispositivo_adquirido Da on Aposento.id = Da.id_aposento join Dispositivo_modelo Dm on Da.modelo = Dm.modelo join Cliente_ha_usado Chu on Da.n_serie = Chu.n_serie_dispositivo join Pedido on Da.n_serie = Pedido.n_serie_dispositivo join Pedido_Factura PF on Pedido.id = PF.id_pedido join Certificado_garantia Cg on PF.n_factura = Cg.n_factura where Aposento.id = ? and Chu.propietario_actual = 1',
      [idAposento]).then(data => {
        let tmpList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let today = new Date();
            let mesHoy = today.getMonth() + 1;
            let anoHoy = today.getFullYear();
            let mesesRestantes = data.rows.item(i).mes_fin_garantia - mesHoy;
            let anosRestantes = data.rows.item(i).ano_fin_garantia - anoHoy;
            tmpList.push({
              mes_fin_garantia: mesesRestantes,
              ano_fin_garantia: anosRestantes,
              n_serie: data.rows.item(i).n_serie,
              prendido: data.rows.item(i).prendido,
              imagen: data.rows.item(i).imagen,
              modelo: data.rows.item(i).modelo,
            });
          }
        }
        tmpQuery.next(tmpList);
      });
  }


  /**
   * Retorna los dispositivosModelo de la BD local
   * @param database 
   * @param tmpQuery 
   * @param cliente 
   * @returns 
   */
  getMisDispositivosmodelo(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, cliente: Cliente) {
    return database.executeSql('select Dispositivo_adquirido.modelo, n_serie, prendido, tipo, imagen, consumo_electrico, marca, mes_fin_garantia, ano_fin_garantia from Cliente_ha_usado join Dispositivo_adquirido  on Cliente_ha_usado.n_serie_dispositivo = Dispositivo_adquirido.n_serie join Dispositivo_modelo Dm on Dispositivo_adquirido.modelo = Dm.modelo join Pedido P on Dispositivo_adquirido.n_serie = P.n_serie_dispositivo join Pedido_Factura PF on P.id = PF.id_pedido join Factura F on PF.n_factura = F.n_factura Join Certificado_garantia Cg on F.n_factura = Cg.n_factura  where Cliente_ha_usado.id_cliente = ? AND propietario_actual = 1;',
      [cliente.id]).then(data => {
        let tmpList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let today = new Date();
            let mesHoy = today.getMonth() + 1;
            let anoHoy = today.getFullYear();
            console.log(data.rows.item(i).mes_fin_garantia, "mes termina la garantia");
            console.log(data.rows.item(i).ano_fin_garantia, "año termina la garantia");

            
            let mesesRestantes = data.rows.item(i).mes_fin_garantia - mesHoy;
            let anosRestantes = data.rows.item(i).ano_fin_garantia - anoHoy;
            tmpList.push({
              modelo: data.rows.item(i).modelo,
              marca: data.rows.item(i).marca,
              consumoElectrico: data.rows.item(i).consumo_electrico,
              tipo: data.rows.item(i).tipo,
              imagen: data.rows.item(i).imagen,
              n_serie: data.rows.item(i).n_serie,
              prendido: data.rows.item(i).prendido,
              mes_fin_garantia: mesesRestantes,
              ano_fin_garantia: anosRestantes,
            });
          }
        }
        tmpQuery.next(tmpList);
      });
  }

  /**
   * Disocia un dispositivo de un propietario
   * @param database 
   * @param clientesHanUsado 
   * @param N_serie 
   * @returns 
   */
  disociarDispositivoDePropietario(database: SQLiteObject, clientesHanUsado:BehaviorSubject<any[]>, N_serie:number) {
    
    return database.executeSql('update Cliente_ha_usado set propietario_actual = 0 where n_serie_dispositivo = ?',
    [N_serie]).then(data => {
      this.loadClienteHaUsado(database, clientesHanUsado);
    });
  }

  /**
   * Asocia un dispositivo a un nuevo propietario
   * @param database 
   * @param clientesHanUsado 
   * @param N_serie 
   * @param data 
   * @returns 
   */
  asociarDispositivoANuevoPropietario(database: SQLiteObject, clientesHanUsado:BehaviorSubject<any[]>, N_serie:number, data:number) {
    
    return database.executeSql('insert into Cliente_ha_usado (n_serie_dispositivo, id_cliente, propietario_actual) values (?,?,1)',
    [N_serie, data]).then(data => {
      this.loadClienteHaUsado(database, clientesHanUsado);
    });
  }

/**
 * Prende un dispositivo en la BD local
 * @param database 
 * @param conexion 
 * @param N_serie 
 * @returns 
 */
  prenderDispositivo(database: SQLiteObject, conexion: BehaviorSubject<any[]>, N_serie: number) {
    let today = new Date();
    let year = today.getFullYear();
    let monts = today.getMonth() + 1;
    let days = today.getDate();
    let hours = today.getHours();
    let mins = today.getMinutes();
    let secs = today.getSeconds();
    let format = year + "-" + monts + "-" + days + " " + hours + ":" + mins + ":" + secs;

    return database.executeSql('update Dispositivo_adquirido set fecha_prendido = ?, prendido=1 where n_serie= ?', [format, N_serie]).then(data => {
      this.loadDispositivosAdquiridos(database, conexion);

    });
  }

  /**
   * Funcion auxiliar para apagar un dispositivo en la BD local
   * @param database 
   * @param conexion 
   * @param N_serie 
   * @returns 
   */
  apagarDispostivoAux(database: SQLiteObject, conexion: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('update Dispositivo_adquirido set prendido=0 where n_serie= ?', [N_serie]).then(data => {
      this.loadDispositivosAdquiridos(database, conexion);

    });
  }

  /**
   * Reotrna la fecha en que se prendio un dispositivo
   * @param database 
   * @param tmpQuery 
   * @param N_serie 
   * @returns 
   */
  getFechaprendido(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('select fecha_prendido from Dispositivo_adquirido where n_serie=? and prendido=1',
      [N_serie]).then(data => {
        
        let tmpList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            console.log(data.rows.item(i))
            console.log(data.rows.item(i).fecha_prendido)
            console.log("fechas?")
            tmpList.push({
              fechaPrendido: data.rows.item(i).fecha_prendido,
            });
          }
        }
        console.log("mi fecha prendido es...", tmpQuery.value[0]);
        tmpQuery.next(tmpList);
      });
  }


}
