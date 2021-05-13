import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Aposento } from 'src/app/tablas-y-relaciones/aposento';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { ClienteHaUsado } from 'src/app/tablas-y-relaciones/cliente_ha_usado';

@Injectable({
  providedIn: 'root'
})
export class AposentoService {
  tmpQuery = new BehaviorSubject([]);


  constructor() { }

  loadAposentos(database: SQLiteObject, aposentos: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Aposento', []).then(data => {

      let aposentosList: Aposento[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          aposentosList.push({
            Id: data.rows.item(i).id,
            NombreCuarto: data.rows.item(i).nombre_cuarto,
            IdCliente: data.rows.item(i).id_cliente,
          });
        }
      }
      aposentos.next(aposentosList);
    });
  }

  loadAposentosPorUsuario(database: SQLiteObject, aposentosPorUsuario: BehaviorSubject<any[]>, cliente:Cliente) {
    return database.executeSql('SELECT * FROM Aposento WHERE id_cliente = ?', [cliente.Id]).then(data => {

      let aposentosList: Aposento[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          aposentosList.push({
            Id: data.rows.item(i).id,
            NombreCuarto: data.rows.item(i).nombre_cuarto,
            IdCliente: data.rows.item(i).id_cliente,
          });
        }
      }
      aposentosPorUsuario.next(aposentosList);
    });
  }

  getAposentos(database:SQLiteObject, myID: number) {
    return database.executeSql('SELECT * FROM Aposento WHERE id_cliente = ?', [myID]).then(data => {

      let aposentosList: Aposento[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          aposentosList.push({
            Id: data.rows.item(i).id,
            NombreCuarto: data.rows.item(i).nombre_cuarto,
            IdCliente: data.rows.item(i).id_cliente,
          });
        }
      }
      this.tmpQuery.next(aposentosList);
    });
  }

  addAposento(database:SQLiteObject,  aposentos: BehaviorSubject<any[]>, cliente:Cliente, nuevoNombre:string) {
    return database.executeSql('insert into Aposento (nombre_cuarto, id_cliente) values (?,?)', [nuevoNombre, cliente.Id]).then(data => {
      this.loadAposentos(database, aposentos);
    });
  }

  deleteAposento(database:SQLiteObject,  aposentos: BehaviorSubject<any[]>, idAposento:number) {
    return database.executeSql('DELETE FROM Aposento WHERE id=?', [idAposento]).then(data => {
      this.loadAposentos(database, aposentos);
    });
  }

  updateNombre(database:SQLiteObject,  aposentos: BehaviorSubject<any[]>, idAposento:number, nuevoNombre:string) {
    return database.executeSql('update Aposento set nombre_cuarto = ? where id =?', [nuevoNombre, idAposento]).then(data => {
      this.loadAposentos(database, aposentos);
    });
  }

  cleanTmpQuery() {
    this.tmpQuery = new BehaviorSubject([]);
  }
}
