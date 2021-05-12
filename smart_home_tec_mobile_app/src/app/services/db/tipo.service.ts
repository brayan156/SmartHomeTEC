import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Regiones } from 'src/app/tablas-y-relaciones/regiones';
import { Tipo } from 'src/app/tablas-y-relaciones/tipo';

@Injectable({
  providedIn: 'root'
})
export class TipoService {

  constructor() { }

  loadTipos(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Tipo', []).then(data => {

      let tmpList: Tipo[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            Nombre : data.rows.item(i).nombre,
            Descripcion : data.rows.item(i).descripcion,
            TiempoDeGarantia: data.rows.item(i).tiempo_de_garantia,
            Imagen: data.rows.item(i).imagen,
          });
        }
      }
      conexion.next(tmpList);
    });
  }
}
