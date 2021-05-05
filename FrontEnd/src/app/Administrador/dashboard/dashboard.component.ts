import { Component, OnInit } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  chart = {
    title: 'Hola',
    type: "AreaChart",
    data: [
      ['London', 8136000],
      ['New York', 8538000],
      ['Paris', 2244000],
      ['Berlin', 3470000],
      ['Kairo', 19500000],
    ],
    columnNames: ['City', 'Inhabitants'],
    options: {
      colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
      is3D: true
    }

  }

  chart2 = {
    title: '',
    type: 'GeoChart',
    data: [
      ["China", "China: 3k"],
      ["India", "India: 1,242,620,000"],
      ["Costa Rica", "Costa Rica: 2k"],
      ["US", "US: 317,842,000"],
      ["Indonesia", "Indonesia: 247,424,598"],
      ["Brazil", "Brazil: 201,032,714"],
      ["Pakistan", "Pakistan: 186,134,000"],
      ["Nigeria", "Nigeria: 173,615,000"],
      ["Bangladesh", "Bangladesh: 152,518,015"],
      ["Russia", "Russia: 146,019,512"],
      ["Japan", "Japan: 127,120,000"]
    ],
    columnNames: ["Country", "Population"],
    options: {
      showTip: true
    },
    width: 550,
    height: 400,

  };

  

  
}
