import { Component, OnInit } from '@angular/core';
import {ExcelAux} from '../../Comunicacion/excel-aux';
import * as faker from 'faker';
@Component({
  selector: 'app-tienda-en-linea',
  templateUrl: './tienda-en-linea.component.html',
  styleUrls: ['./tienda-en-linea.component.css']
})
export class TiendaEnLineaComponent implements OnInit {


  importContacts: ExcelAux[] = [];
  exportContacts: ExcelAux[] = [];
  constructor() {
  }

  ngOnInit(): void {
  }
}
