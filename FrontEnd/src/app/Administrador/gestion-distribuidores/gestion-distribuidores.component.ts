import { Component, OnInit } from '@angular/core';
import {ServiciosService} from '../../servicios.service';
import {Distribuidor} from '../../Comunicacion/distribuidor';
import {Regiones} from '../../Comunicacion/regiones';

@Component({
  selector: 'app-gestion-distribuidores',
  templateUrl: './gestion-distribuidores.component.html',
  styleUrls: ['./gestion-distribuidores.component.css']
})
export class GestionDistribuidoresComponent implements OnInit {

  constructor(private service: ServiciosService) { }

  listaDistribuidores: Distribuidor[] = [];
  // tslint:disable-next-line:new-parens
  distribuidor: Distribuidor = new Distribuidor;
  // tslint:disable-next-line:new-parens

  listaDeRegiones: Regiones[] = [] ;


  ngOnInit(): void {
    this.service.obtenerDistribuidores().subscribe(lista => {
      this.listaDistribuidores = lista;
      console.log(this.listaDistribuidores);
    });
    this.service.getRegiones().subscribe(lista => {this.listaDeRegiones = lista;
                                                   console.log(lista);
    });
  }
  public crearDistribuidor(distribuidor: Distribuidor): void{
    this.service.crearDistribuidord(distribuidor).subscribe(a => {console.log(a);
                                                                  this.ngOnInit();
    });
  }

  public editarDistribuido(distribuidor: Distribuidor): void{
    console.log(distribuidor);
    this.service.editarDistribuidores(distribuidor.cedulaJuridica, distribuidor).subscribe(a => {console.log(a);
                                                                                                 this.ngOnInit();
    });
  }

  public eliminarDistribuidor(distribuidor: Distribuidor): void{
    this.service.eliminarDistribuidor(distribuidor.cedulaJuridica).subscribe(a => {console.log(a);
                                                                                   this.ngOnInit();
    });
  }

  public obtenerInformacionItem(distribuidor: Distribuidor): void{
    this.distribuidor = distribuidor;
  }

}
