import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ServiciosService} from '../../servicios.service';
import {Cliente} from '../../Comunicacion/cliente';

@Component({
  selector: 'app-nav-u',
  templateUrl: './nav-u.component.html',
  styleUrls: ['./nav-u.component.css']
})
export class NavUComponent implements OnInit {

  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  constructor(private router: Router,
              private service: ServiciosService) { }

  ngOnInit(): void {
  }

  navegation(router): void{
    this.router.navigateByUrl('/usuario/'.concat(router));
    this.service.getCliente().subscribe(clienteAux => this.cliente = clienteAux);
  }
}
