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
  listaDispositivosComprables: {dispositivoSeVendeEn: DispositivoSeVendeEn, dispositivoModelo: DispositivoModelo}[] = [];

  // tslint:disable-next-line:new-parens
  tipo: Tipo = new Tipo;
  // tslint:disable-next-line:new-parens
  distribuidor: Distribuidor = new Distribuidor;

  // tslint:disable-next-line:new-parens
  dispositivoactual: {dispositivoSeVendeEn: DispositivoSeVendeEn, dispositivoModelo: DispositivoModelo};
  dispositivoCompra: {dispositivoSeVendeEn: DispositivoSeVendeEn, dispositivoModelo: DispositivoModelo};

  hora: Date = new Date();
  /**
   * Inicialisa el html con los datos que recupera de la base de datos para la tienda en linea
   */
  ngOnInit(): void {
    this.service.getCliente().subscribe(clienteAux =>
    {
      this.cliente = clienteAux;
      this.service.cliente = clienteAux;
      this.service.obtenerTiendaLinea(this.cliente.pais).subscribe( data => {
        this.dispositivos = data;
        this.filtroDeLista();
      });
    });
  }
  public filtroDeLista(): void{
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dispositivos.length; i ++) {
      if (this.dispositivos[i].dispositivoModelo.tipo != null && this.dispositivos[i].dispositivoSeVendeEn.cantidad > 0) {
        this.listaDispositivosComprables.push(this.dispositivos[i]);
      }
    }
    console.log(this.listaDispositivosComprables);
  }
  /**
   * Guarda el item al cual se selecciona para ver mas informacion o comprar
   * @param item que desea comprar
   */
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

  /**
   * Envia los datos para crear los reportes y enviar el correo al cliente que desea comprar un dispositivo
   */
  // tslint:disable-next-line:typedef
  public comprar() {
    this.service.comprar(this.dispositivoactual.dispositivoSeVendeEn, this.cliente.id).subscribe(c => {
      console.log(c);
      this.dispositivoactual.dispositivoSeVendeEn.cantidad -= 1;
      this.service.editarDispostivoSeVende(this.dispositivoactual.dispositivoSeVendeEn).subscribe(a => console.log(a));
      // tslint:disable-next-line:max-line-length
      alert('Compra realizada, ' + ' Numero consecutivo: ' + c.pedido.id + ' Fecha: ' + c.factura.dia + '/' + c.factura.mes + '/' + c.factura.ano + ' Hora: ' +
        // tslint:disable-next-line:max-line-length
        this.hora.getHours() + this.hora.getMinutes() + ' Tipo Dispositivo: ' + this.dispositivoactual.dispositivoModelo.tipo + ' Marca :' + this.dispositivoactual.dispositivoModelo.marca +
      ' Numero de serie: ' + c.pedido.nSerieDispositivo + ' Precio: ??? ' + this.dispositivoSeVende.precio);
    });
  }
}
