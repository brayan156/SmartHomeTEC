import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Historial } from 'src/app/tablas-y-relaciones/historial';
import { Pedido } from 'src/app/tablas-y-relaciones/pedido';
import { PedidoFactura } from 'src/app/tablas-y-relaciones/pedidoFactura';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor() { }

  loadPedidos(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Pedido', []).then(data => {

      let tmpList: Pedido[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            id : data.rows.item(i).id,
            monto : data.rows.item(i).monto,
            idCliente : data.rows.item(i).id_cliente,
            nSerieDispositivo : data.rows.item(i).n_serie_dispositivo,
          });
        }
      }
      conexion.next(tmpList);
    });
  }

  loadPedidosFactura(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Pedido_Factura', []).then(data => {

      let tmpList: PedidoFactura[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            idPedido: data.rows.item(i).id_pedido,
            nFactura: data.rows.item(i).n_factura,
          });
        }
      }
      conexion.next(tmpList);
    });
  }
}
