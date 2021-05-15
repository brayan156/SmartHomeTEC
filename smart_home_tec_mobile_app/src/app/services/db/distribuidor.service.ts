import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { ClienteEntregaEn } from 'src/app/tablas-y-relaciones/cliente_entrega_en';
import { Distribuidor } from 'src/app/tablas-y-relaciones/distribuidor';

@Injectable({
  providedIn: 'root'
})
export class DistribuidorService {

  constructor() { }

  /**
   * Carga los distruibuidores
   * @param database 
   * @param conexion 
   * @returns 
   */
  loadDistribuidores(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Distribuidor', []).then(data => {

      let tmpList: Distribuidor[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            CedulaJuridica: data.rows.item(i).cedula_juridica,
            Pais: data.rows.item(i).pais,
            nombre: data.rows.item(i).nombre,
            imagen: data.rows.item(i).imagen,
          });
        }
      }
      conexion.next(tmpList);
    });
  }

}
