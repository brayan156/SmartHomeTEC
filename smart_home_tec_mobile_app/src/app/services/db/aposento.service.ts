import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Aposento } from 'src/app/tablas-y-relaciones/aposento';
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

  cleanTmpQuery() {
    this.tmpQuery = new BehaviorSubject([]);
  }
}
