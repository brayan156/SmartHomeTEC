import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Factura } from 'src/app/tablas-y-relaciones/factura';
import { Historial } from 'src/app/tablas-y-relaciones/historial';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor() { }

  loadHistoriales(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Historial', []).then(data => {

      let tmpList: Historial[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            NHistorial : data.rows.item(i).n_historial,
            NSerie : data.rows.item(i).n_serie,
            Dia : data.rows.item(i).dia,
            Mes : data.rows.item(i).mes,
            Ano: data.rows.item(i).ano,
            MinutosDeUso: data.rows.item(i).minutos_de_uso,
            Hora: data.rows.item(i).hora,
          });
        }
      }
      conexion.next(tmpList);
    });
  }

}
