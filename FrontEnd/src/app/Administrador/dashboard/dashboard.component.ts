import { Component, OnInit } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';
import {ServiciosService} from '../../servicios.service';
import {DispositivoAdquirido} from '../../Comunicacion/dispositivo-adquirido';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  /**
   * Contructor del componete el cual se utiliza para la gestion de informacion del dispositivos
   * @param service se utiliza para comunicar los servicios, estos se utilizan para comunicar la base de datos con
   * la aplicacion web
   */
  constructor(private service: ServiciosService) { }

  cantidadPromedio: number;
  cantidadTotalDispositivos: number;
  cantidadTotalDispositivosRegion: {pais: string , cantidad: number}[] = [];
  ListaDispositivosTotalesRegistros: {dispositivoAdquirido: DispositivoAdquirido, dueno: string}[] = [];

  /**
   * Recarga los valores a mostrar en el HTML cada que se inicaliza la pagina
   */
  ngOnInit(): void {
    this.service.getdispositvosasociados().subscribe(numero => {
      this.cantidadTotalDispositivos = numero;
      console.log(this.cantidadPromedio);
    });
    this.service.getDispositivoRegion().subscribe(tabla => {
      this.cantidadTotalDispositivosRegion = tabla;
      console.log(this.cantidadTotalDispositivosRegion);
    });
    this.service.getDispositiviosRegistrados().subscribe(tabla1 => {
      this.ListaDispositivosTotalesRegistros = tabla1;
      console.log(this.ListaDispositivosTotalesRegistros);
    });
    this.service.getDispositivoPromedio().subscribe(numero => {
      this.cantidadPromedio = numero;
      console.log(this.cantidadPromedio);
    });
  }
}
