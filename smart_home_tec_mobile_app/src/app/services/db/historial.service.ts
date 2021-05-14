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
            NHistorial: data.rows.item(i).n_historial,
            NSerie: data.rows.item(i).n_serie,
            Dia: data.rows.item(i).dia,
            Mes: data.rows.item(i).mes,
            Ano: data.rows.item(i).ano,
            MinutosDeUso: data.rows.item(i).minutos_de_uso,
            Hora: data.rows.item(i).hora,
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
   let data = [historial.MinutosDeUso, historial.NSerie, historial.Dia, historial.Mes, historial.Ano, historial.Hora];
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

  apagarDispositivo(database: SQLiteObject, historiales: BehaviorSubject<any[]>, N_serie: number, fechaPrendido: Date) {
    let today = new Date();

    let historial = new Historial();

    let diffTime = today.valueOf() - fechaPrendido.valueOf();
    let total_dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let total_minutos = Math.ceil(diffTime / (1000 * 60));
    console.log(total_minutos + " mins");
    console.log(total_dias + " days");

    historial.Ano = fechaPrendido.getFullYear();
    historial.Mes = fechaPrendido.getMonth() + 1;
    historial.Dia = fechaPrendido.getDate();
    historial.Hora = fechaPrendido.getHours();
    historial.NSerie = N_serie;


    if (historiales.value.some(hist =>
      hist.NSerie == historial.NSerie
      && hist.Ano == historial.Ano
      && hist.Mes == historial.Mes
      && hist.Dia == historial.Dia
      && hist.Hora == historial.Hora)) {

      let histo = historiales.value.find(hist =>
        hist.NSerie == historial.NSerie && hist.Ano == historial.Ano && hist.Mes == historial.Mes &&
        hist.Dia == historial.Dia && hist.Hora == historial.Hora);

      if (total_minutos + fechaPrendido.getMinutes() <= 60) {
        histo.MinutosDeUso += total_minutos;
      } else {
        histo.MinutosDeUso += 60 - fechaPrendido.getMinutes();

      }
      // Actualizar histo dentro historiales
      this.updateTotalMins(database, historiales, histo);


    } else {
      if (fechaPrendido.getHours() == today.getHours()) {
        historial.MinutosDeUso = total_minutos;
      } else {
        historial.MinutosDeUso = 60 - fechaPrendido.getMinutes();
      }

      // agregar historial a historiales
      let data = [historial.NSerie, historial.Dia, historial.Mes, historial.Ano, historial.Hora, historial.MinutosDeUso];
      this.insertHistorial(database, historiales, data);

    }


    var hora_dia = fechaPrendido.getHours() + 1;
    for (let i = total_dias; i >= 0; i--)
    {
      while (hora_dia < 24) {
        let h = new Historial();

        h.Dia = fechaPrendido.getDate();
        h.Mes = fechaPrendido.getMonth() + 1;
        h.Ano = fechaPrendido.getFullYear();;
        h.Hora = hora_dia;

        if (fechaPrendido.toDateString() == today.toDateString() && hora_dia == today.getHours()) {
          h.MinutosDeUso = today.getMinutes();
          hora_dia = 24;
        }
        else {
          h.MinutosDeUso = 60;
        }
        // Agregar a historiales h
        let data = [h.NSerie, h.Dia, h.Mes, h.Ano, h.Hora, h.MinutosDeUso];
        this.insertHistorial(database, historiales, data);
        // setTimeout(() => {
        //   console.log("estoy esperando 300ms...")
        // }, 300);
        hora_dia++;
      }
      fechaPrendido.setDate(fechaPrendido.getDate()+1);
      hora_dia = 0;
    }

    // Update prendido de dispositivo a off
    this.apagarDispostivoAux(database, historiales, N_serie);


  }
}
