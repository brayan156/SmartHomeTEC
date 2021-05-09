import { Component, OnInit } from '@angular/core';
import {Cliente} from '../../Comunicacion/cliente';
import {ServiciosService} from '../../servicios.service';
import {ClienteEntregaEn} from '../../Comunicacion/cliente-entrega-en';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-gestion-perfil',
  templateUrl: './gestion-perfil.component.html',
  styleUrls: ['./gestion-perfil.component.css']
})
export class GestionPerfilComponent implements OnInit {

  constructor(private service: ServiciosService ) { }

  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  // tslint:disable-next-line:new-parens
  newCliente: Cliente = new Cliente;
  // tslint:disable-next-line:new-parens
  direccionEntrega: ClienteEntregaEn = new ClienteEntregaEn;
  ngOnInit(): void {
    this.cliente = this.service.cliente;
    console.log(this.cliente);

  }
  public prueba(): void{
  console.log(this.cliente.primerApellido);
  }

  // tslint:disable-next-line:typedef
  anadirUbicacion(direccionEntrega: ClienteEntregaEn){
    if (direccionEntrega.DireccionEntrega1 !== ''){
      direccionEntrega.IdCliente = this.cliente.id;
      this.service.crearDirrecionEntrega(direccionEntrega).subscribe(c => console.log(c));
    }else{
      console.log('Valor nulo');
    }
  }
}
