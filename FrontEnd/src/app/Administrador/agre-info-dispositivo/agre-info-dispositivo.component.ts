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

  // tslint:disable-next-line:new-parens
  dispositivocreado: DispositivoModelo = new DispositivoModelo;
  modeloscreados: DispositivoModelo[] = [];
  // tslint:disable-next-line:new-parens
  dipositivoModelo: DispositivoModelo = new DispositivoModelo;
  // tslint:disable-next-line:new-parens
  oldDispositivocreado: DispositivoModelo = new DispositivoModelo;
  // tslint:disable-next-line:new-parens
  newDispositivoc: DispositivoModelo = new DispositivoModelo;



  ngOnInit(): void {
    this.service.obtenerDispositivosModelo().subscribe(lista => {
      this.modeloscreados = lista;
      console.log(this.modeloscreados);
    });
  }
  public crearDispositivo(dispositivoModelo: DispositivoModelo): void{
    console.log(dispositivoModelo);
    dispositivoModelo.tipo = null;
    this.service.crearDispositivoModelo(dispositivoModelo).subscribe( a => console.log(a));
    this.ngOnInit();
  }
  public editarDispositivo(dispositivoModelo: DispositivoModelo): void{
    console.log(dispositivoModelo);
    this.service.editarDipositivoModelo(dispositivoModelo.modelo, dispositivoModelo).subscribe(a => console.log(a));
    this.ngOnInit();

  }

  public eliminarDispositivo(dispositivoModelo: DispositivoModelo): void{
    this.service.eliminarDispositivosModelo(dispositivoModelo.modelo).subscribe(a => console.log(a));
    this.ngOnInit();

  }
  public obtenerInformacionItem(dipositivo: DispositivoModelo): void{
    this.oldDispositivocreado = dipositivo;
    this.ngOnInit();
  }
}
