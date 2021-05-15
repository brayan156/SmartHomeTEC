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

  /**
   * Constructor del componente para la gestion de distribuidores
   * @param service se utiliza para comunicar los servicios, estos se utilizan para comunicar la base de datos con
   * la aplicacion web
   */
  constructor(private service: ServiciosService) { }

  listaDistribuidores: Distribuidor[] = [];
  // tslint:disable-next-line:new-parens
  distribuidor: Distribuidor = new Distribuidor;
  // tslint:disable-next-line:new-parens

  listaDeRegiones: Regiones[] = [] ;

  /**
   * Recarga los valores a mostrar en el HTML cada que se inicaliza la pagina
   */
  ngOnInit(): void {
    this.service.obtenerDistribuidores().subscribe(lista => {
      this.listaDistribuidores = lista;
      console.log(this.listaDistribuidores);
    });
    this.service.getRegiones().subscribe(lista => {this.listaDeRegiones = lista;
                                                   console.log(lista);
    });
  }

  /**
   * Funcion con la cual el administrador puede crear un nuevo distribuidor desde el html y la base de datos, siempre y cuando llene los
   * inputs necesarios
   * @param distribuidor el objeto que se crea el crear un nuevo distribuidor
   */
  public crearDistribuidor(distribuidor: Distribuidor): void{
    this.service.crearDistribuidord(distribuidor).subscribe(a => {
      console.log(a);
      if (a === 'distribuidor existente'){
        alert('Ya existe un distribuidor con esta cedula juridica');
      }
      else{
        this.ngOnInit();
      }
    });
  }

  /**
   * Funcion con la cual el administrador puede editar un distribuidor desde el html y l;a base de datos, siempre y cuando llene los
   * inputs necesarios
   * @param distribuidor clase que se crea para editar el antiguo distribuidor
   */
  public editarDistribuido(distribuidor: Distribuidor): void{
    console.log(distribuidor);
    this.service.editarDistribuidores(distribuidor.cedulaJuridica, distribuidor).subscribe(a => {console.log(a);
                                                                                                 this.ngOnInit();
    });
  }

  /**
   * Funcion con la cual el administrador puede eliminar un distribuidor desde el html y la base de datos
   * @param distribuidor del distribuidor actual se tomara el id para eliminarlo en la base de datos
   */
  public eliminarDistribuidor(distribuidor: Distribuidor): void{
    this.service.eliminarDistribuidor(distribuidor.cedulaJuridica).subscribe(respuesta => {
      console.log(respuesta);
      if (respuesta === 'distribuidor tiene dispositivos asociados'){
        alert('No se puede eliminar este distribuidor puesto que tiene dispositivos asosciados');
      }
      else {
        this.ngOnInit();
      }
    });
  }

  /**
   * Obtiene informacion del distribuidor del actual dentro del ngfor
   * @param distribuidor distribuidor
   */

  public obtenerInformacionItem(distribuidor: Distribuidor): void{
    this.distribuidor = distribuidor;
  }

}
