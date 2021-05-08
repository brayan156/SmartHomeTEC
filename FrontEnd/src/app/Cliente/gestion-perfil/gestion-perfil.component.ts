import { Component, OnInit } from '@angular/core';
import {Cliente} from '../../Comunicacion/cliente';
import {ServiciosService} from '../../servicios.service';

@Component({
  selector: 'app-gestion-perfil',
  templateUrl: './gestion-perfil.component.html',
  styleUrls: ['./gestion-perfil.component.css']
})
export class GestionPerfilComponent implements OnInit {

  constructor(private service: ServiciosService ) { }

  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  ngOnInit(): void {
    this.cliente = this.service.cliente;
    console.log(this.cliente);

  }
}
