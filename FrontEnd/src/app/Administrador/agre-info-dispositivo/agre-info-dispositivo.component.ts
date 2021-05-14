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

  /**
   * Contructor del componete el cual se utiliza para la gestion de informacion del dispositivos
   * @param router servicio para moverser en el navbar
   * @param service se utiliza para comunicar los servicios, estos se utilizan para comunicar la base de datos con
   * la aplicacion web
   */
  constructor(private router: Router, private service: ServiciosService) { }

  /**
   * Variables utilizadas para mostrar o modificar datos dentro del HTML
   */
  // tslint:disable-next-line:new-parens
  dispositivocreado: DispositivoModelo = new DispositivoModelo;
  modeloscreados: DispositivoModelo[] = [];
  // tslint:disable-next-line:new-parens
  dipositivoModelo: DispositivoModelo = new DispositivoModelo;
  // tslint:disable-next-line:new-parens
  oldDispositivocreado: DispositivoModelo = new DispositivoModelo;
  // tslint:disable-next-line:new-parens
  newDispositivoc: DispositivoModelo = new DispositivoModelo;


  /**
   * Recarga los valores a mostrar en el HTML cada que se inicaliza la pagina
   */
  ngOnInit(): void {
    this.service.obtenerDispositivosModelo().subscribe(lista => {
      this.modeloscreados = lista;
      console.log(this.modeloscreados);
    });
  }

  /**
   * Funcion utilizada para la creacion  de nuevos dispositivos
   * @param dispositivoModelo dispositvo el cual el adminitrador crea llenado los datos llenando los respectivos inputs del html
   */
  public crearDispositivo(dispositivoModelo: DispositivoModelo): void{
    console.log(dispositivoModelo);
    dispositivoModelo.tipo = null;
    this.service.crearDispositivoModelo(dispositivoModelo).subscribe( respuesta => {
      if (respuesta === 'Modelo Existente'){
        alert('Este modelo ya existe');
      }else {
        this.ngOnInit();
      }
    });
  }

  /**
   * Funcion utilizada para editar dispositivos creados con antiguedad
   * @param dispositivoModelo
   */
  public editarDispositivo(dispositivoModelo: DispositivoModelo): void{
    console.log(dispositivoModelo);
    this.service.editarDipositivoModelo(dispositivoModelo.modelo, dispositivoModelo).subscribe(respuesta => {
      console.log(respuesta);
      if (respuesta === 'el dispositivo ya ha sido comprado'){
        alert('No se puede editar este dispositivo puesto que ya ha sido comprado');
      }else {
        this.ngOnInit();
      }
    });
  }

  /**
   * Elimina un dispositivo ya creado
   * @param dispositivoModelo dispositivo a eliminar
   */
  public eliminarDispositivo(dispositivoModelo: DispositivoModelo): void{
    this.service.eliminarDispositivosModelo(dispositivoModelo.modelo).subscribe(respuesta => {
      console.log(respuesta);
      this.ngOnInit();
      console.log(respuesta);
      if (respuesta === 'dispositivo ya comprado'){
        alert('No se puede eliminar este dispositivo puesto ya ha sido comprado');
      }else {
        this.ngOnInit();
      }
    });

  }

  /**
   * Obtener informacion del dispositivo actual, esto se utiliza para mostrar de forma efectiva la informacion en los modales
   * @param dipositivo dispositivo actual de item dentro de ngFor del html
   */
  public obtenerInformacionItem(dipositivo: DispositivoModelo): void{
    this.oldDispositivocreado = dipositivo;
  }
}
