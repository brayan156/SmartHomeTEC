import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteServiceService {


  clientes = new BehaviorSubject([]);
  productos = new BehaviorSubject([]);
  tmpQuery = new BehaviorSubject([]);

  constructor() {

  }

  loadClientes(database: SQLiteObject, clientes: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Cliente', []).then(data => {

      let clientesBD: Cliente[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientesBD.push({
            id: data.rows.item(i).ID,
            email: data.rows.item(i).email,
            contrasena: data.rows.item(i).contrasena,
            primerApellido: data.rows.item(i).primerApellido,
            segundoApellido: data.rows.item(i).segundoApellido,
            nombre: data.rows.item(i).nombre,
            pais: data.rows.item(i).Pais,
          });
        }
      }
      clientes.next(clientesBD);
    });
  }

  

  validateCliente(database: SQLiteObject, usuario: BehaviorSubject<any[]>, email: string, contrasena: string) {
    return database.executeSql('SELECT * FROM Cliente WHERE email = ? AND contrasena = ?', [email, contrasena]).then(data => {

      let modelo = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          modelo.push({
            id: data.rows.item(i).id,
            email: data.rows.item(i).email,
            contrasena: data.rows.item(i).contrasena,
            primerApellido: data.rows.item(i).primer_apellido,
            segundoApellido: data.rows.item(i).segundo_apellido,
            nombre: data.rows.item(i).nombre,
            pais: data.rows.item(i).pais,
          });
        }
      }
      usuario.next(modelo);
    });
  }

  cleanTmpQuery() {
    this.tmpQuery = new BehaviorSubject([]);
  }
  
  getTmpQuery() {
    return this.tmpQuery.asObservable();
  }

}
