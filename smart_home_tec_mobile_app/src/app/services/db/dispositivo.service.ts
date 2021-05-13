import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from 'src/app/tablas-y-relaciones/cliente';
import { ClienteHaUsado } from 'src/app/tablas-y-relaciones/cliente_ha_usado';
import { DispositivoAdquirido } from 'src/app/tablas-y-relaciones/dispositivoAdquirido';
import { DispositivoModelo } from 'src/app/tablas-y-relaciones/DispositivoModelo';
import { DispositivoSeVendeEn } from 'src/app/tablas-y-relaciones/DispositivoSeVendeEn';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  clientes = new BehaviorSubject([]);

  constructor() { }

  loadDispositivos(database: SQLiteObject, clientes: BehaviorSubject<any[]>) {
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

  loadDispositivosModelo(database: SQLiteObject, coleccion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Dispositivo_modelo', []).then(data => {

      let tmpList: DispositivoModelo[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            Modelo: data.rows.item(i).modelo,
            Marca: data.rows.item(i).marca,
            ConsumoElectrico: data.rows.item(i).consumo_electrico,
            Tipo: data.rows.item(i).tipo,
            Imagen: data.rows.item(i).imagen,
          });
        }
      }
      coleccion.next(tmpList);
    });
  }

  loadDispositivosAdquiridos(database: SQLiteObject, coleccion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Dispositivo_adquirido', []).then(data => {

      let tmpList: DispositivoAdquirido[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            NSerie: data.rows.item(i).n_serie,
            Prendido: data.rows.item(i).prendido,
            Modelo: data.rows.item(i).modelo,
            IdAposento: data.rows.item(i).id_aposento,
            FechaPrendido: data.rows.item(i).fecha_prendido,
          });
        }
      }
      coleccion.next(tmpList);
    });
  }

  loadDispositivosSeVendeEn(database: SQLiteObject, coleccion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Dispositivo_se_vende_en', []).then(data => {

      let tmpList: DispositivoSeVendeEn[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            CjDistribuidor: data.rows.item(i).cj_distribuidor,
            ModeloDispotivo: data.rows.item(i).modelo_dispotivo,
            Precio: data.rows.item(i).precio,
            Cantidad: data.rows.item(i).cantidad,
          });
        }
      }
      coleccion.next(tmpList);
    });
  }


  loadClienteHaUsado(database: SQLiteObject, clientes: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Cliente_ha_usado', []).then(data => {

      let clientesHanUsadoList: ClienteHaUsado[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientesHanUsadoList.push({
            IdCliente: data.rows.item(i).id_cliente,
            NSerieDispositivo: data.rows.item(i).n_serie_dispositivo,
            PropietarioActual: data.rows.item(i).propietario_actual
          });
        }
      }
      clientes.next(clientesHanUsadoList);
    });
  }

  existeDispositivo(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('SELECT modelo FROM Dispositivo_adquirido WHERE n_serie = ?', [N_serie]).then(data => {
      let modelo = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          modelo.push({
            modelo: data.rows.item(i).modelo
          });
        }
      }
      tmpQuery.next(modelo);
    });
  }

  fueUsadoDispositivo(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('SELECT id_cliente FROM Cliente_ha_usado WHERE n_serie_dispositivo = ?', [N_serie]).then(data => {
      let clientes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          clientes.push({
            cliente: data.rows.item(i).id_cliente
          });
        }
      }
      tmpQuery.next(clientes);
    });
  }

  coincideInformacion(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    console.log("entre a coincideInfo");
    return database.executeSql("SELECT n_serie, descripcion, marca, tipo FROM Dispositivo_adquirido JOIN Dispositivo_modelo on Dispositivo_adquirido.modelo = Dispositivo_modelo.modelo JOIN Tipo ON Dispositivo_modelo.tipo = Tipo.nombre where n_serie = ?", [N_serie]).then(data => {
      let dispositivos = [];
      console.log(data);
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          dispositivos.push({
            N_serie: data.rows.item(i).n_serie,
            descripcion: data.rows.item(i).descripcion,
            marca: data.rows.item(i).marca,
            tipo: data.rows.item(i).tipo
          });
        }
      }
      console.log(data);
      console.log(dispositivos);
      tmpQuery.next(dispositivos);
    });
  }


  addClienteHaUsado(database: SQLiteObject, clienteHaUsado: ClienteHaUsado, clientesHanUsado: BehaviorSubject<any[]>) {
    let data = [clienteHaUsado.NSerieDispositivo, clienteHaUsado.IdCliente, 1];
    console.log("estoy ingresando los siguientes datos ", clienteHaUsado.IdCliente, clienteHaUsado.NSerieDispositivo, clienteHaUsado.PropietarioActual);
    return database.executeSql('INSERT INTO Cliente_ha_usado (n_serie_dispositivo, id_cliente, propietario_actual) VALUES (?, ?, ?)', data).then(data => {
      this.loadClienteHaUsado(database, clientesHanUsado);
    });
  }

  updateDispositivoAdquirido(database: SQLiteObject, dispositivosAdquiridos: BehaviorSubject<any[]>, idAposento: number, n_serie: number) {
    console.log("estoy actualizando los siguientes datos ", idAposento, n_serie);
    return database.executeSql('UPDATE Dispositivo_adquirido SET id_aposento = ? WHERE n_serie = ?', [idAposento, n_serie]).then(data => {
      this.loadDispositivosAdquiridos(database, dispositivosAdquiridos);
    });
  }

  getMisDispositivosPorAposento(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, cliente: Cliente, idAposento: number) {
    return database.executeSql('select mes_fin_garantia, ano_fin_garantia, n_serie, prendido, tipo, imagen from Aposento join Dispositivo_adquirido Da on Aposento.id = Da.id_aposento join Dispositivo_modelo Dm on Da.modelo = Dm.modelo join Cliente_ha_usado Chu on Da.n_serie = Chu.n_serie_dispositivo join Pedido on Da.n_serie = Pedido.n_serie_dispositivo join Pedido_Factura PF on Pedido.id = PF.id_pedido join Certificado_garantia Cg on PF.n_factura = Cg.n_factura where Aposento.id = ? and Chu.propietario_actual = 1',
      [idAposento]).then(data => {
        let tmpList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let today = new Date();
            let mesHoy = today.getMonth() + 1;
            let anoHoy = today.getFullYear();
            let mesesRestantes = data.rows.item(i).mes_fin_garantia - mesHoy;
            let anosRestantes = data.rows.item(i).ano_fin_garantia - anoHoy;
            tmpList.push({
              mes_fin_garantia: mesesRestantes,
              ano_fin_garantia: anosRestantes,
              n_serie: data.rows.item(i).n_serie,
              prendido: data.rows.item(i).prendido,
              imagen: data.rows.item(i).imagen,
              modelo: data.rows.item(i).modelo,
            });
          }
        }
        tmpQuery.next(tmpList);
      });
  }


  getMisDispositivosModelo(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, cliente: Cliente) {
    return database.executeSql('select Da.modelo, n_serie, prendido, tipo, imagen, consumo_electrico, marca, mes_fin_garantia, ano_fin_garantia from Cliente_ha_usado join Dispositivo_adquirido Da on Cliente_ha_usado.n_serie_dispositivo = Da.n_serie join Dispositivo_modelo Dm on Da.modelo = Dm.modelo join Pedido P on Da.n_serie = P.n_serie_dispositivo join Pedido_Factura PF on P.id = PF.id_pedido join Factura F on PF.n_factura = F.n_factura Join Certificado_garantia Cg on F.n_factura = Cg.n_factura  where Cliente_ha_usado.id_cliente = ? AND propietario_actual = true;',
      [cliente.Id]).then(data => {
        let tmpList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let today = new Date();
            let mesHoy = today.getMonth() + 1;
            let anoHoy = today.getFullYear();
            let mesesRestantes = data.rows.item(i).mes_fin_garantia - mesHoy;
            let anosRestantes = data.rows.item(i).ano_fin_garantia - anoHoy;
            tmpList.push({
              Modelo: data.rows.item(i).modelo,
              Marca: data.rows.item(i).marca,
              ConsumoElectrico: data.rows.item(i).consumo_electrico,
              Tipo: data.rows.item(i).tipo,
              Imagen: data.rows.item(i).imagen,
              N_serie: data.rows.item(i).n_serie,
              Prendido: data.rows.item(i).prendido,
              mes_fin_garantia: mesesRestantes,
              ano_fin_garantia: anosRestantes,
            });
          }
        }
        tmpQuery.next(tmpList);
      });
  }



  getFechaPrendido(database: SQLiteObject, tmpQuery: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('select fecha_prendido from Dispositivo_adquirido where n_serie=? and prendido=1',
      [N_serie]).then(data => {
        let tmpList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            tmpList.push({
              FechaPrendido: data.rows.item(i).fecha_prendido,
            });
          }
        }
        tmpQuery.next(tmpList);
      });
  }
}
