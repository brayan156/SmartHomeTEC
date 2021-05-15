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
            nFactura :  data.rows.item(i).n_factura,
            dia :  data.rows.item(i).dia,
            mes :  data.rows.item(i).mes,
            ano :  data.rows.item(i).ano,
          });
        }
      }
      conexion.next(tmpList);
    });
  }
}
