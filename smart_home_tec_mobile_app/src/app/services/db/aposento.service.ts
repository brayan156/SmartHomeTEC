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

  /**
   * Carga los aposentos
   * @param database 
   * @param aposentos 
   * @returns 
   */
  loadAposentos(database: SQLiteObject, aposentos: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Aposento', []).then(data => {

      let aposentosList: Aposento[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          aposentosList.push({
            id: data.rows.item(i).id,
            nombreCuarto: data.rows.item(i).nombre_cuarto,
            idCliente: data.rows.item(i).id_cliente,
          });
        }
      }
      aposentos.next(aposentosList);
    });
  }

  /**
   * Carga los aposentos por usuario
   * @param database 
   * @param aposentosPorUsuario 
   * @param cliente 
   * @returns 
   */
  loadAposentosPorUsuario(database: SQLiteObject, aposentosPorUsuario: BehaviorSubject<any[]>, cliente:Cliente) {
    return database.executeSql('SELECT * FROM Aposento WHERE id_cliente = ?', [cliente.id]).then(data => {

      let aposentosList: Aposento[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          aposentosList.push({
            id: data.rows.item(i).id,
            nombreCuarto: data.rows.item(i).nombre_cuarto,
            idCliente: data.rows.item(i).id_cliente,
          });
        }
      }
      aposentosPorUsuario.next(aposentosList);
    });
  }

  /**
   * Retorna los aposentos en la BD local
   * @param database 
   * @param myID 
   * @returns 
   */
  getAposentos(database:SQLiteObject, myID: number) {
    return database.executeSql('SELECT * FROM Aposento WHERE id_cliente = ?', [myID]).then(data => {

      let aposentosList: Aposento[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          aposentosList.push({
            id: data.rows.item(i).id,
            nombreCuarto: data.rows.item(i).nombre_cuarto,
            idCliente: data.rows.item(i).id_cliente,
          });
        }
      }
      this.tmpQuery.next(aposentosList);
    });
  }

  /**
   * Agrega un aposento en la base de datos local
   * @param database 
   * @param aposentos 
   * @param cliente 
   * @param nuevonombre 
   * @returns 
   */
  addAposento(database:SQLiteObject,  aposentos: BehaviorSubject<any[]>, cliente:Cliente, nuevonombre:string) {
    return database.executeSql('insert into Aposento (nombre_cuarto, id_cliente) values (?,?)', [nuevonombre, cliente.id]).then(data => {
      this.loadAposentos(database, aposentos);
    });
  }

  /**
   * Borra un aposento de la BD local
   * @param database 
   * @param aposentos 
   * @param idAposento 
   * @returns 
   */
  deleteAposento(database:SQLiteObject,  aposentos: BehaviorSubject<any[]>, idAposento:number) {
    return database.executeSql('DELETE FROM Aposento WHERE id=?', [idAposento]).then(data => {
      this.loadAposentos(database, aposentos);
    });
  }

  /**
   * Actualiza el nombre de un aposento en la BD local
   * @param database 
   * @param aposentos 
   * @param idAposento 
   * @param nuevonombre 
   * @returns 
   */
  updatenombre(database:SQLiteObject,  aposentos: BehaviorSubject<any[]>, idAposento:number, nuevonombre:string) {
    return database.executeSql('update Aposento set nombre_cuarto = ? where id =?', [nuevonombre, idAposento]).then(data => {
      this.loadAposentos(database, aposentos);
    });
  }

  /**
   * Limpia el objeto que se usa para hacer queries genericas
   */
  cleanTmpQuery() {
    this.tmpQuery = new BehaviorSubject([]);
  }
}
