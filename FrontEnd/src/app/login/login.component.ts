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

  /**
   * Constructor del moldulo login
   * @param router libreria para nevegar entre los links
   * @param service servicios para comunicar el login con la base de datos
   * @param cookieService libreria para guardar datos cuando la pagina haga refrech no se borre
   */
  constructor(
    private router: Router, private service: ServiciosService, private cookieService: CookieService) {

  }

  // tslint:disable-next-line:new-parens
  administrador: Administrador = new Administrador;
  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;

  listaClientes: Cliente[] = [];
  listaDeRegiones: Regiones[] = [];

  ngOnInit(): void {
    this.service.getRegiones().subscribe(lista => {
      this.listaDeRegiones = lista;
      console.log(lista);
      this.service.getListaCliente().subscribe(clienteLista => this.listaClientes = clienteLista);
    });
  }

  /**
   * Funcio para cambiar en el HTML a vista admin
   */
  chageAdmin(): void {
    this.typeLogin = 0;
  }

  /**
   * Funcio para cambiar en el HTML a vista usuario
   */
  chageUser(): void {
    this.typeLogin = 1;
  }

  /**
   * Funcio para saber que tipo de login es
   */
  loginType(): boolean {
    if (this.typeLogin === 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * En dicha funcion el usuario o administrador se postean en caso de que sus datos sean correctos podran navegar en sus respectivas vistas
   */
  navegation(): void {
    if (this.typeLogin === 0) {
      this.service.ValidarLogin(this.administrador.correo, this.administrador.contrasena).subscribe(lista => {
        // tslint:disable-next-line:triple-equals
        if (lista.length == 0) {
          alert('Favor revisar su correo electronico o contraseña');
        } else {
          console.log('datos correctos');
          this.service.administrador = lista[0];
          this.router.navigate(['/administrador']);
        }
      });
    } else {
      this.service.validarLogin2(this.cliente.email, this.cliente.contrasena).subscribe(lista => {
        // tslint:disable-next-line:triple-equals
        if (lista.length == 0) {
          alert('Favor revisar su correo electronico o contraseña');
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

  /**
   * Funcion con la cual los clientes pueden hacer acceder a una cuenta en la base de datos
   * @param cliente el objeto cliente el cual permite el aceso de un nuevo usuario
   */
  // tslint:disable-next-line:typedef
  crearCliente(cliente: Cliente) {
    // tslint:disable-next-line:prefer-for-of
    this.service.crearCliente(this.cliente).subscribe(c => {
      if (c === 'cliente existente') {
        alert('Este numero de cedula pertenece a un cliente');
      } else {
        // tslint:disable-next-line:no-shadowed-variable
        this.service.habilitarAposentos(cliente.id).subscribe(c => {
          console.log(c);
        });
      }
    });
  }
}

