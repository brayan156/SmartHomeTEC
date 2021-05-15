import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { ClienteEntregaEn } from 'src/app/tablas-y-relaciones/cliente_entrega_en';

@Injectable({
  providedIn: 'root'
})
export class DireccionEntregaService {

  constructor() { }

  loadDirecciones(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM direccion_entrega', []).then(data => {

      let tmpList: ClienteEntregaEn[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            idCliente: data.rows.item(i).id_cliente,
            direccionEntrega1: data.rows.item(i).direccion_entrega,
          });
        }
      }
      conexion.next(tmpList);
    });
  }

}
