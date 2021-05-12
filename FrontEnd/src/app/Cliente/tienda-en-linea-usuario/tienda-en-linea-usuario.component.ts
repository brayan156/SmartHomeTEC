import { Component, OnInit } from '@angular/core';
import {ServiciosService} from '../../servicios.service';
import {Cliente} from '../../Comunicacion/cliente';
import {DispositivoModelo} from '../../Comunicacion/dispositivo-modelo';
import {DispositivoSeVendeEn} from '../../Comunicacion/dispositivo-se-vende-en';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-tienda-en-linea-usuario',
  templateUrl: './tienda-en-linea-usuario.component.html',
  styleUrls: ['./tienda-en-linea-usuario.component.css']
})
export class TiendaEnLineaUsuarioComponent implements OnInit {

  constructor(private service: ServiciosService,
              private cookieService: CookieService) { }

  // tslint:disable-next-line:new-parens
  cliente: Cliente = new Cliente;
  // tslint:disable-next-line:new-parens
  dispositivoModelo: DispositivoModelo = new DispositivoModelo;
  // tslint:disable-next-line:new-parens
  dispositivoSeVende: DispositivoSeVendeEn = new DispositivoSeVendeEn;
  dispositivos: {dispositivoSeVendeEn: DispositivoSeVendeEn , dispositivoModelo: DispositivoModelo}[] = [];

  ngOnInit(): void {
    this.service.getCliente().subscribe(clienteAux =>
    {this.cliente = clienteAux;
     this.service.obtenerTiendaLinea(this.cliente.pais).subscribe( data => this.dispositivos = data);
    });
  }


}
