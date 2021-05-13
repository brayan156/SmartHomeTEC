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
    this.service.getCliente().subscribe(clienteAux =>
    {this.cliente = clienteAux;
    });
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

  generarPdf(): void {
    this.service.obtenerPDFMensual(this.listaAux , this.cliente.nombre, this.cliente.primerApellido, this.cliente.segundoApellido).subscribe(res => {
      var newBlob = new Blob([res], { type: "application/pdf" });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = 'Reporte_De_Consumo_Mensual.pdf';

      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function() {
        window.URL.revokeObjectURL(data);
      }, 100);

    });
  }
}
