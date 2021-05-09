import { Component, OnInit } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';
import {ServiciosService} from '../../servicios.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service: ServiciosService) { }

  cantidadPromedio: number;
  cantidadTotalDispositivos: number;
  CantidadTotalDispositivosRegion = [];
  ListaDispositivosTotales = [];

  chart = {
    title: '',
    type: 'BarChart',
    data: [
      ['London', 8136000],
      ['New York', 8538000],
      ['Paris', 2244000],
      ['Berlin', 3470000],
      ['Kairo', 19500000],
    ],
    columnNames: ['', ''],
    options: {
      colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f4f5f8', '#f4f5f8'],
      is3D: true,
      backgroundColor: {
        // fill: '#92949c',
        fillOpacity: 0,
      },
      hAxis: {
        textStyle: {color: '#FFF'}
      },
      vAxis: {
        textStyle: {color: '#FFF'}
      },
    }

  };

  chart2 = {
    title: '',
    type: 'GeoChart',
    data: [
      ['China', '3000'],
      ['India', '1,242,620,000'],
      ['Costa Rica', 'Costa Rica: 2k'],
      ['US', 'US: 317,842,000'],
      ['Indonesia', 'Indonesia: 247,424,598'],
      ['Brazil', 'Brazil: 201,032,714'],
      ['Pakistan', 'Pakistan: 186,134,000'],
      ['Nigeria', 'Nigeria: 173,615,000'],
      ['Bangladesh', 'Bangladesh: 152,518,015'],
      ['Russia', 'Russia: 146,019,512'],
      ['Japan', 'Japan: 127,120,000']
    ],
    columnNames: ['Country', 'Population'],
    options: {
      showTip: true,
      is3D: true,
      backgroundColor: {
        // fill: '#92949c',
        fillOpacity: 0,
      },
      hAxis: {
        textStyle:{color: '#FFF'}
      },
      vAxis: {
        textStyle:{color: '#FFF'}
      },
    },


  };

  ngOnInit(): void {
  }
  public getDato(): void{
    this.service.getdispositvosasociados().subscribe( numero => this.cantidadPromedio = numero);
  }
}
