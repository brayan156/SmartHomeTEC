import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { PedidoFactura } from 'src/app/tablas-y-relaciones/pedidoFactura';
import { Regiones } from 'src/app/tablas-y-relaciones/regiones';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor() { }

  /**
   * Carga las regiones a la base de datos local
   * @param database 
   * @param conexion 
   * @returns 
   */
  loadRegiones(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Regiones', []).then(data => {

      let tmpList: Regiones[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            Pais: data.rows.item(i).pais,
            Continente: data.rows.item(i).continente,
          });
        }
      }
      conexion.next(tmpList);
    });
  }
}
