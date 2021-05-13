import { Component, OnInit } from '@angular/core';
import {Tipo} from '../../Comunicacion/tipo';
import {ServiciosService} from '../../servicios.service';
import {DispositivoModelo} from '../../Comunicacion/dispositivo-modelo';

@Component({
  selector: 'app-gestion-de-tipos-dis',
  templateUrl: './gestion-de-tipos-dis.component.html',
  styleUrls: ['./gestion-de-tipos-dis.component.css']
})
export class GestionDeTiposDisComponent implements OnInit {
  constructor(private service: ServiciosService) { }

  // tslint:disable-next-line:new-parens
  tipo: Tipo = new Tipo;
  listaDeTipos: Tipo[] = [];
  // tslint:disable-next-line:new-parens
  tipoActual: Tipo = new Tipo;
  listaDeModelos: DispositivoModelo[] = [];
  listaDeModelosSinTipo: DispositivoModelo[] = [];
  // tslint:disable-next-line:new-parens
  listaDeModelosConTipo: DispositivoModelo[] = [];
  oldDispositivocreado: DispositivoModelo = new DispositivoModelo;


  ngOnInit(): void {
    this.service.getTiposDispositivos().subscribe(lista => {
      this.listaDeTipos = lista;
      console.log(this.listaDeTipos);
    });
    this.service.obtenerDispositivosModelo().subscribe(lista => {this.listaDeModelos = lista;
                                                                 this.dispositivosSinTipo();
    });
  }

  public crearTipoDipositivo(tipo: Tipo): void{
    console.log(tipo);
    this.service.crearTipoDispositivo(tipo).subscribe(a => {console.log(a);
                                                            this.ngOnInit();
    });

  }
  public editarTipoDipositivo(tipo: Tipo): void{
    this.service.editarTipoDispositivo(tipo.nombre, tipo).subscribe(a => {console.log(a);
                                                                          this.ngOnInit();
    });
  }

  public eliminarTipoDispositivo(): void{
    this.service.eliminarTipoDispositivo(this.tipoActual.nombre).subscribe(a => {console.log(a);
                                                                                 this.ngOnInit();
    });
  }

  public tipoActualF(tipo: Tipo): void{
    this.tipoActual = tipo;
    this.dispositivosModeloConTipo(tipo);
  }

  public obtenerInformacionItem(dipositivo: DispositivoModelo): void{
    this.oldDispositivocreado = dipositivo;
  }

  public editarDispositivo(dispositivoModelo: DispositivoModelo): void{
    console.log(dispositivoModelo);
    this.service.editarDipositivoModelo(dispositivoModelo.modelo, dispositivoModelo).subscribe(a => {console.log(a);
                                                                                                     this.ngOnInit();
    });
  }

  public dispositivosSinTipo(): void{
    this.listaDeModelosSinTipo =[];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listaDeModelos.length; i++){
      if (this.listaDeModelos[i].tipo === null ){
        this.listaDeModelosSinTipo.push(this.listaDeModelos[i]);
      }
    }
    console.log(this.listaDeModelosSinTipo);
  }
  public dispositivosModeloConTipo(item: Tipo): void{
    this.listaDeModelosConTipo = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listaDeModelos.length; i++ ){
      if (this.listaDeModelos[i].tipo === item.nombre){
        this.listaDeModelosConTipo.push(this.listaDeModelos[i]);
      }
    }
    console.log(this.listaDeModelosConTipo);
  }

  public desasociarDispositivo(dispositivoModelo: DispositivoModelo): void{
    dispositivoModelo.tipo = null;
    this.service.editarDipositivoModelo(dispositivoModelo.modelo, dispositivoModelo).subscribe(a => {
      console.log(a);
      this.ngOnInit();
    });
  }
}

