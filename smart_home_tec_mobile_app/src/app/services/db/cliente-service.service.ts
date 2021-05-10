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
            Id: data.rows.item(i).ID,
            Email: data.rows.item(i).Email,
            Contrasena: data.rows.item(i).Contrasena,
            PrimerApellido: data.rows.item(i).PrimerApellido,
            SegundoApellido: data.rows.item(i).SegundoApellido,
            Nombre: data.rows.item(i).Nombre,
            Pais: data.rows.item(i).Pais,
          });
        }
      }
      clientes.next(clientesBD);
    });
  }

  

  validateCliente(database: SQLiteObject, email:string, contrasena:string) {
    return database.executeSql('SELECT * FROM Cliente WHERE email = ? AND contrasena = ?', [email, contrasena]).then(data => {

      let modelo = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          modelo.push({
            Id: data.rows.item(i).ID,
            Email: data.rows.item(i).Email,
            Contrasena: data.rows.item(i).Contrasena,
            PrimerApellido: data.rows.item(i).PrimerApellido,
            SegundoApellido: data.rows.item(i).SegundoApellido,
            Nombre: data.rows.item(i).Nombre,
            Pais: data.rows.item(i).Pais,
          });
        }
      }
      this.tmpQuery.next(modelo);
    });
  }

  cleanTmpQuery() {
    this.tmpQuery = new BehaviorSubject([]);
  }
  


}
