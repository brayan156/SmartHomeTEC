import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Distribuidor } from 'src/app/tablas-y-relaciones/distribuidor';
import { Factura } from 'src/app/tablas-y-relaciones/factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor() { }

  loadFacturas(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Factura', []).then(data => {

      let tmpList: Factura[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            NFactura :  data.rows.item(i).n_factura,
            Dia :  data.rows.item(i).dia,
            Mes :  data.rows.item(i).mes,
            Ano :  data.rows.item(i).ano,
          });
        }
      }
      conexion.next(tmpList);
    });
  }
}
