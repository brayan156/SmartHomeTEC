import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Administrador } from '../Comunicacion/administrador';
import { ServiciosService } from '../servicios.service';
import {Cliente} from '../Comunicacion/cliente';
import {CookieService} from 'ngx-cookie-service';
import {Regiones} from '../Comunicacion/regiones';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public typeLogin = 0;

  constructor(
    private router: Router, private service: ServiciosService, private cookieService: CookieService) {

  }

  // tslint:disable-next-line:new-parens
  administrador: Administrador = new Administrador;
  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  listaDeRegiones: Regiones[] = [] ;
  ngOnInit(): void {
    this.service.getRegiones().subscribe(lista => {this.listaDeRegiones = lista;
                                                   console.log(lista);
    });
  }

  chageAdmin(): void{
    this.typeLogin = 0;
  }

  chageUser(): void{
    this.typeLogin = 1;
  }
  loginType(): boolean{
    if (this.typeLogin === 0){
      return true;
    }
    else {
      return false;
    }
  }
  navegation(): void{
    if (this.typeLogin === 0) {
      this.service.ValidarLogin(this.administrador.correo, this.administrador.contrasena).subscribe(lista => {
        // tslint:disable-next-line:triple-equals
        if (lista.length == 0) {
          console.log('datos incorrectos');
          // mensaje administrador invalido
        } else {
          console.log('datos correctos');
          this.service.administrador = lista[0];
          this.router.navigate(['/administrador']);
        }
      });
    }
    else {
      this.service.validarLogin2(this.cliente.email, this.cliente.contrasena).subscribe(lista => {
        // tslint:disable-next-line:triple-equals
        if (lista.length == 0) {
          console.log('datos incorrectos');
          // mensaje administrador invalido
        } else {
          console.log('datos correctos');
          this.service.cliente = lista[0];
          this.cliente = this.service.cliente;
          this.cookieService.set('cedula', (this.cliente.id).toString());
          this.router.navigate(['/usuario']);
        }
      });
    }
  }
  // tslint:disable-next-line:typedef
  crearCliente(cliente: Cliente) {
    this.service.crearCliente(cliente).subscribe(c => {
      console.log(cliente.id);
      this.service.habilitarAposentos(cliente.id).subscribe(a => console.log(a));
    });
  }
}
