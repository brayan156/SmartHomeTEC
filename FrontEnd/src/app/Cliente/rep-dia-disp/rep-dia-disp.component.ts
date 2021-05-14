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
    this.service.getCliente().subscribe(clienteAux =>
    {this.cliente = clienteAux;
    });
  }

  /**
   * Parsea la fecha que resive del html para poder generar el reporte y la tabala
   */
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

  /**
   * obtiene la tabla para mostrar en el html
   */
  // tslint:disable-next-line:typedef
  public obtenetTabla(){
    this.service.getReporteDias(this.cliente.id, this.diaI , this.mesI , this.anoI , this.diaF , this.mesF , this.anoF).
    subscribe(lista => {this.listaReporte = lista; console.log(this.listaReporte);});
  }

  /**
   * Genera el reporte del PDF
   */
  generarPdf(): void {
    this.service.obtenerPDFDia(this.listaReporte, this.cliente.nombre, this.cliente.primerApellido, this.cliente.segundoApellido ).subscribe(res => {
      var newBlob = new Blob([res], { type: "application/pdf" });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = 'Reportes_De_Mayor_Consumo_Diario.pdf';

      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function() {
        window.URL.revokeObjectURL(data);
      }, 100);

    });
  }

}
