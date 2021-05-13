import { Component, OnInit } from '@angular/core';
import {ServiciosService} from '../../servicios.service';
import {Cliente} from '../../Comunicacion/cliente';
import {DispositivoModelo} from '../../Comunicacion/dispositivo-modelo';
import {DispositivoSeVendeEn} from '../../Comunicacion/dispositivo-se-vende-en';
import {CookieService} from 'ngx-cookie-service';
import {Tipo} from '../../Comunicacion/tipo';
import {Distribuidor} from '../../Comunicacion/distribuidor';

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
  dispositivos: { dispositivoSeVendeEn: DispositivoSeVendeEn, dispositivoModelo: DispositivoModelo }[] = [];

  // tslint:disable-next-line:new-parens
  tipo: Tipo = new Tipo;
  // tslint:disable-next-line:new-parens
  distribuidor: Distribuidor = new Distribuidor;

  // tslint:disable-next-line:new-parens
  dispositivoactual: {dispositivoSeVendeEn: DispositivoSeVendeEn, dispositivoModelo: DispositivoModelo};
  dispositivoCompra: {dispositivoSeVendeEn: DispositivoSeVendeEn, dispositivoModelo: DispositivoModelo};

  ngOnInit(): void {
    this.service.getCliente().subscribe(clienteAux =>
    {
      this.cliente = clienteAux;
      this.service.cliente = clienteAux;
      this.service.obtenerTiendaLinea(this.cliente.pais).subscribe( data => this.dispositivos = data);
    });
  }
  // tslint:disable-next-line:typedef
  public guardarobjeto(item: {dispositivoSeVendeEn: DispositivoSeVendeEn, dispositivoModelo: DispositivoModelo}) {
    this.dispositivoactual = item;
    this.dispositivoModelo = item.dispositivoModelo;
    this.dispositivoSeVende = item.dispositivoSeVendeEn;
    this.service.getTipo(this.dispositivoModelo.tipo).subscribe(tipoAux => {
      this.tipo = tipoAux;
      console.log(this.tipo);
      this.service.getDistribuidor(this.dispositivoSeVende.cjDistribuidor).subscribe(distribuidorAux =>
        this.distribuidor = distribuidorAux);
    });
  }
  // tslint:disable-next-line:typedef
  public comprar() {
    this.service.comprar(this.dispositivoactual.dispositivoSeVendeEn, this.cliente.id).subscribe(c =>
      console.log(c));
  }

}
