import { Component, OnInit } from '@angular/core';
import {Tipo} from '../../Comunicacion/tipo';
import {ServiciosService} from '../../servicios.service';

@Component({
  selector: 'app-gestion-de-tipos-dis',
  templateUrl: './gestion-de-tipos-dis.component.html',
  styleUrls: ['./gestion-de-tipos-dis.component.css']
})
export class GestionDeTiposDisComponent implements OnInit {
  constructor(private service: ServiciosService) { }

  tipo: Tipo = new Tipo();
  listaDeTipos: Tipo[] = [];

  ngOnInit(): void {
    this.service.getTiposDispositivos().subscribe(lista => {
      this.listaDeTipos = lista;
      console.log(this.listaDeTipos);
    });
  }

  public crearDipositivo(tipo: Tipo): void{
    console.log(tipo);
    this.service.crearTipoDispositivo(tipo).subscribe(a => console.log(a));
  }
}
