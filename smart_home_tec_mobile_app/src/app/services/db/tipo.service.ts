import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Regiones } from 'src/app/tablas-y-relaciones/regiones';
import { tipo } from 'src/app/tablas-y-relaciones/tipo';

@Injectable({
  providedIn: 'root'
})
export class tipoService {

  constructor() { }

  /**
   * Carga los tipos a la base de datos local
   * @param database 
   * @param conexion 
   * @returns 
   */
  loadtipos(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM tipo', []).then(data => {

      let tmpList: tipo[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            nombre : data.rows.item(i).nombre,
            descripcion : data.rows.item(i).descripcion,
            tiempoDeGarantia: data.rows.item(i).tiempo_de_garantia,
            imagen: data.rows.item(i).imagen,
          });
        }
      }
      conexion.next(tmpList);
    });
  }
}
