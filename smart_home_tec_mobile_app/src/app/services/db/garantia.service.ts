import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { CertificadoDeGarantia } from 'src/app/tablas-y-relaciones/certificado_garantia';
import { ClienteHaUsado } from 'src/app/tablas-y-relaciones/cliente_ha_usado';

@Injectable({
  providedIn: 'root'
})
export class GarantiaService {

  constructor() { }

  loadGarantias(database: SQLiteObject, garantias: BehaviorSubject<any[]>) {
    return database.executeSql('SELECT * FROM Certificado_garantia', []).then(data => {

      let tmpList: CertificadoDeGarantia[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tmpList.push({
            nFactura : data.rows.item(i).n_factura,
            mesFinGarantia : data.rows.item(i).mes_fin_garantia,
            anoFinGarantia : data.rows.item(i).ano_fin_garantia,
          });
        }
      }
      garantias.next(tmpList);
    });
  }

}
