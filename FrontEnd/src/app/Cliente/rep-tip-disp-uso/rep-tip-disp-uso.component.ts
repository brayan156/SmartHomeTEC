import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../servicios.service';
import {Cliente} from '../../Comunicacion/cliente';

@Component({
  selector: 'app-rep-tip-disp-uso',
  templateUrl: './rep-tip-disp-uso.component.html',
  styleUrls: ['./rep-tip-disp-uso.component.css']
})
export class RepTipDispUsoComponent implements OnInit {

  constructor(private service: ServiciosService) { }

  public cliente: Cliente;
  public datosAMostrar: {tipo: string, uso: number} [] = [];
  public datos: { tipo: string, uso: number }[] = [];

  /**
   * Incialisa el HTML con los de la base de datos
   */
  ngOnInit(): void {
    this.service.getCliente().subscribe(clienteAux =>
    {this.cliente = clienteAux;
     this.service.getConsumoTipo(this.cliente.id).subscribe( tabla => this.datosAMostrar = tabla);
     this.service.obtenereportetipo().subscribe(datos => this.datos = datos);
    });
    console.log(this.datos);
  }


  /**
   * Genera el pdf de dispostivos por tipo
   */
  generarPdf(): void {
    this.service.obtenerPDFreportetipo(this.datos, this.cliente.nombre, this.cliente.primerApellido, this.cliente.segundoApellido).subscribe(res => {
      var newBlob = new Blob([res], { type: "application/pdf" });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = "Tipos_de_dispositivos_de_mayor_uso.pdf";

      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function() {
        window.URL.revokeObjectURL(data);
      }, 100);

      });
  }

}
