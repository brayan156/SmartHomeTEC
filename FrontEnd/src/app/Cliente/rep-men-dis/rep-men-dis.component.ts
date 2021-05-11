import { Component, OnInit } from '@angular/core';
import {ServiciosService} from '../../servicios.service';
import {Cliente} from '../../Comunicacion/cliente';
import {Datos} from '../../Comunicacion/datos';

@Component({
  selector: 'app-rep-men-dis',
  templateUrl: './rep-men-dis.component.html',
  styleUrls: ['./rep-men-dis.component.css']
})
export class RepMenDisComponent implements OnInit {

  constructor(public service: ServiciosService) { }
  public mesAux: string;
  public ano: number;
  public mes: number;
  public listaAux: {consumo: number , datos: Datos}[];

  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  ngOnInit(): void {
    this.cliente = this.service.cliente;
  }
  // tslint:disable-next-line:typedef
  public printAux(){
    // tslint:disable-next-line:radix
    this.ano = parseInt(this.mesAux.slice(0, 4));
    // tslint:disable-next-line:radix
    this.mes = parseInt(this.mesAux.slice(5, 7));
    console.log(this.ano);
    console.log(this.mes);
    this.muestraTabla();
  }
  // tslint:disable-next-line:typedef
  public muestraTabla(){
    this.service.getReporteMes(this.cliente.id, this.ano, this.mes).subscribe(tabla => {this.listaAux = tabla;
                                                                                        console.log(this.listaAux);
  });
  }

}
