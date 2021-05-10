import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { ClienteHaUsado } from 'src/app/tablas-y-relaciones/cliente_ha_usado';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  clientes = new BehaviorSubject([]);
  tmpQuery = new BehaviorSubject([]);

  constructor() { }

  loadDispositivos(database: SQLiteObject, clientes: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Cliente', []).then(data => {

      let clientesBD: Cliente[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientesBD.push({
            Id: data.rows.item(i).ID,
            Email: data.rows.item(i).Email,
            Contrasena: data.rows.item(i).Contrasena,
            PrimerApellido: data.rows.item(i).PrimerApellido,
            SegundoApellido: data.rows.item(i).SegundoApellido,
            Nombre: data.rows.item(i).Nombre,
            Pais: data.rows.item(i).Pais,
          });
        }
      }
      clientes.next(clientesBD);
    });
  }

  loadClienteHaUsado(database: SQLiteObject, clientes: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Cliente_ha_usado', []).then(data => {

      let clientesHanUsadoList: ClienteHaUsado[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientesHanUsadoList.push({
            IdCliente: data.rows.item(i).id_cliente,
            NSerieDispositivo: data.rows.item(i).n_serie_dispositivo,
            PropietarioActual: data.rows.item(i).propietario_actual
          });
        }
      }
      clientes.next(clientesHanUsadoList);
    });
  }

  existeDispositivo(database: SQLiteObject, N_serie: number) {
    return database.executeSql('SELECT modelo FROM Dispositivo_adquirido WHERE n_serie = ?', [N_serie]).then(data => {

      let modelo = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          modelo.push({
            modelo: data.rows.item(i).modelo
          });
        }
      }
      this.tmpQuery.next(modelo);
    });
  }

  fueUsadoDispositivo(database: SQLiteObject, N_serie: number) {
    return database.executeSql('SELECT id_cliente FROM Cliente_ha_usado WHERE n_serie = ?', [N_serie]).then(data => {
      let clientes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientes.push({
            cliente: data.rows.item(i).id_cliente
          });
        }
      }
      this.tmpQuery.next(clientes);
    });
  }

  coincideInformacion(database: SQLiteObject, N_serie: number) {
    return database.executeSql("SELECT n_serie, descripcion, marca, tipo FROM Dispositivo_adquirido JOIN Dispositivo_modelo on Dispositivo_adquirido.modelo = Dispositivo_modelo.modelo JOIN Tipo ON Dispositivo_modelo.tipo = Tipo.nombre where n_serie = ?"
      , [N_serie]).then(data => {

        let dispositivos = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            dispositivos.push({
              N_serie: data.rows.item(i).n_serie,
              descripcion: data.rows.item(i).descripcion,
              marca: data.rows.item(i).marca,
              tipo: data.rows.item(i).tipo
            });
          }
        }
        this.tmpQuery.next(dispositivos);
      });
  }


  addClienteHaUsado(database: SQLiteObject, clienteHaUsado: ClienteHaUsado, clientesHanUsado: BehaviorSubject<any[]>) {
    let data = [clienteHaUsado.NSerieDispositivo, clienteHaUsado.IdCliente, clienteHaUsado.PropietarioActual];
    return database.executeSql('INSERT INTO Cliente_ha_usado (n_serie_dispositivo, id_cliente, propietario_actual) VALUES (?, ?, ?)', data).then(data => {
      this.loadClienteHaUsado(database, clientesHanUsado);
    });
  }

  cleanTmpQuery() {
    this.tmpQuery = new BehaviorSubject([]);
  }
}
