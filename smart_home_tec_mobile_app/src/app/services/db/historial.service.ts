import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { Factura } from 'src/app/tablas-y-relaciones/factura';
import { Historial } from 'src/app/tablas-y-relaciones/historial';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor() { }

  loadHistoriales(database: SQLiteObject, conexion: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Historial', []).then(data => {

      let tmpList: Historial[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            nHistorial: data.rows.item(i).n_historial,
            nSerie: data.rows.item(i).n_serie,
            dia: data.rows.item(i).dia,
            mes: data.rows.item(i).mes,
            ano: data.rows.item(i).ano,
            minutosDeUso: data.rows.item(i).minutos_de_uso,
            hora: data.rows.item(i).hora,
          });
        }
      }
      conexion.next(tmpList);
    });
  }


  insertHistorial(database: SQLiteObject, conexion: BehaviorSubject<any[]>, data: any[]) {
    return database.executeSql('insert into Historial ( n_serie, dia, mes, ano, hora, minutos_de_uso) values (?,?,?,?,?,?)', data).then(data => {
      this.loadHistoriales(database, conexion);

    });
  }

  updateTotalMins(database: SQLiteObject, conexion: BehaviorSubject<any[]>, historial: Historial) {
   let data = [historial.minutosDeUso, historial.nSerie, historial.dia, historial.mes, historial.ano, historial.hora];
    return database.executeSql('update Historial set minutos_de_uso = ? where n_serie = ? and dia = ? and mes = ? and ano = ? and hora = ?', data).then(data => {
      this.loadHistoriales(database, conexion);

    });
  }

  prenderDispositivo(database: SQLiteObject, conexion: BehaviorSubject<any[]>, N_serie: number) {
    let today = new Date();
    return database.executeSql('update Dispositivo_adquirido set fecha_prendido = ?, prendido=1 where n_serie= ?', [today, N_serie]).then(data => {
      this.loadHistoriales(database, conexion);

    });
  }

  apagarDispostivoAux(database: SQLiteObject, conexion: BehaviorSubject<any[]>, N_serie: number) {
    return database.executeSql('update Dispositivo_adquirido set prendido=0 where n_serie= ?', [ N_serie]).then(data => {
      this.loadHistoriales(database, conexion);

    });
  }

  apagarDispositivo(database: SQLiteObject, historiales: BehaviorSubject<any[]>, N_serie: number, fechaprendido: Date) {
    let today = new Date();

    let historial = new Historial();

    let diffTime = today.valueOf() - fechaprendido.valueOf();
    let total_dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let total_minutos = Math.ceil(diffTime / (1000 * 60));
    console.log(total_minutos + " mins");
    console.log(total_dias + " days");

    historial.ano = fechaprendido.getFullYear();
    historial.mes = fechaprendido.getMonth() + 1;
    historial.dia = fechaprendido.getDate();
    historial.hora = fechaprendido.getHours();
    historial.nSerie = N_serie;


    if (historiales.value.some(hist =>
      hist.nSerie == historial.nSerie
      && hist.ano == historial.ano
      && hist.mes == historial.mes
      && hist.dia == historial.dia
      && hist.hora == historial.hora)) {

      let histo = historiales.value.find(hist =>
        hist.nSerie == historial.nSerie && hist.ano == historial.ano && hist.mes == historial.mes &&
        hist.dia == historial.dia && hist.hora == historial.hora);

      if (total_minutos + fechaprendido.getMinutes() <= 60) {
        histo.minutosDeUso += total_minutos;
      } else {
        histo.minutosDeUso += 60 - fechaprendido.getMinutes();

      }
      // Actualizar histo dentro historiales
      this.updateTotalMins(database, historiales, histo);


    } else {
      if (fechaprendido.getHours() == today.getHours()) {
        historial.minutosDeUso = total_minutos;
      } else {
        historial.minutosDeUso = 60 - fechaprendido.getMinutes();
      }

      // agregar historial a historiales
      let data = [historial.nSerie, historial.dia, historial.mes, historial.ano, historial.hora, historial.minutosDeUso];
      this.insertHistorial(database, historiales, data);

    }


    var hora_dia = fechaprendido.getHours() + 1;
    for (let i = total_dias; i >= 0; i--)
    {
      while (hora_dia < 24) {
        let h = new Historial();

        h.dia = fechaprendido.getDate();
        h.mes = fechaprendido.getMonth() + 1;
        h.ano = fechaprendido.getFullYear();;
        h.hora = hora_dia;

        if (fechaprendido.toDateString() == today.toDateString() && hora_dia == today.getHours()) {
          h.minutosDeUso = today.getMinutes();
          hora_dia = 24;
        }
        else {
          h.minutosDeUso = 60;
        }
        // Agregar a historiales h
        let data = [h.nSerie, h.dia, h.mes, h.ano, h.hora, h.minutosDeUso];
        this.insertHistorial(database, historiales, data);
        // setTimeout(() => {
        //   console.log("estoy esperando 300ms...")
        // }, 300);
        hora_dia++;
      }
      fechaprendido.setDate(fechaprendido.getDate()+1);
      hora_dia = 0;
    }

    // Update prendido de dispositivo a off
    this.apagarDispostivoAux(database, historiales, N_serie);


  }
}
