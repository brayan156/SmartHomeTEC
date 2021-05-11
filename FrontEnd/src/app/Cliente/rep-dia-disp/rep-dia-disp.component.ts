import { Component, OnInit } from '@angular/core';
import {ServiciosService} from '../../servicios.service';
import {Cliente} from '../../Comunicacion/cliente';
import {Hora} from '../../Comunicacion/hora';

@Component({
  selector: 'app-rep-dia-disp',
  templateUrl: './rep-dia-disp.component.html',
  styleUrls: ['./rep-dia-disp.component.css']
})
export class RepDiaDispComponent implements OnInit {

  constructor(private service: ServiciosService) { }
  public fechaAuxI: string;
  public anoI: number;
  public mesI: number;
  public diaI: number;

  public fechaAuxF: string;
  public anoF: number;
  public mesF: number;
  public diaF: number;
  public listaReporte: {hora: Hora, promedio_dispositivos: number, cantidadTotalMinutos: number}[] = [];
  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  ngOnInit(): void {
    this.cliente = this.service.cliente;
  }

  // tslint:disable-next-line:typedef
  public auxFuntion(){
    // tslint:disable-next-line:radix
    this.anoI = parseInt(this.fechaAuxI.slice(0, 4));
    // tslint:disable-next-line:radix
    this.mesI = parseInt(this.fechaAuxI.slice(5, 7));
    // tslint:disable-next-line:radix
    this.diaI = parseInt(this.fechaAuxI.slice(8, 11));
    // tslint:disable-next-line:radix
    this.anoF = parseInt(this.fechaAuxF.slice(0, 4));
    // tslint:disable-next-line:radix
    this.mesF = parseInt(this.fechaAuxF.slice(5, 7));
    // tslint:disable-next-line:radix
    this.diaF = parseInt(this.fechaAuxF.slice(8, 11));
    this.obtenetTabla();
  }
  // tslint:disable-next-line:typedef
  public obtenetTabla(){
    this.service.getReporteDias(this.cliente.id, this.diaI , this.mesI , this.anoI , this.diaF , this.mesF , this.anoF).
    subscribe(lista => {this.listaReporte = lista; console.log(this.listaReporte);});
  }

}
