import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DispositivoModelo } from '../../Comunicacion/dispositivo-modelo';
import { ServiciosService } from '../../servicios.service';

@Component({
  selector: 'app-agre-info-dispositivo',
  templateUrl: './agre-info-dispositivo.component.html',
  styleUrls: ['./agre-info-dispositivo.component.css']
})
export class AgreInfoDispositivoComponent implements OnInit {
  public navVerticalActive = false ;

  constructor(private router: Router, private service: ServiciosService) { }

  dispositivocreado: DispositivoModelo = new DispositivoModelo;
  modeloscreados: DispositivoModelo[]= [];

  ngOnInit(): void {
    this.service.obtenerDispositivosModelo().subscribe(lista => {
      this.modeloscreados = lista;
      console.log(this.modeloscreados);
    });
  }
}
