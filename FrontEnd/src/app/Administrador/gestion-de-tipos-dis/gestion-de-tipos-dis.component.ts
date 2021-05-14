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
  /**
   * Constructor para la gestion de tipos en los dispositivos
   * @param service aca se encuntrar todas las funciones de servicios para la comunicacion de la base de datos
   */
  constructor(private service: ServiciosService) {
  }

  // tslint:disable-next-line:new-parens
  tipo: Tipo = new Tipo;
  listaDeTipos: Tipo[] = [];
  // tslint:disable-next-line:new-parens
  tipoActual: Tipo = new Tipo;
  listaDeModelos: DispositivoModelo[] = [];
  listaDeModelosSinTipo: DispositivoModelo[] = [];
  // tslint:disable-next-line:new-parens
  listaDeModelosConTipo: DispositivoModelo[] = [];
  // tslint:disable-next-line:new-parens
  oldDispositivocreado: DispositivoModelo = new DispositivoModelo;

  /**
   * Inicializa el componete y acede a los datos dentro de la base de datos para mostralos en el
   * HTML de angular
   */
  ngOnInit(): void {
    this.service.getTiposDispositivos().subscribe(lista => {
      this.listaDeTipos = lista;
      console.log(this.listaDeTipos);
    });
    this.service.obtenerDispositivosModelo().subscribe(lista => {
      this.listaDeModelos = lista;
      this.dispositivosSinTipo();
    });
  }

  /**
   * Crea la un nuevo tipo dispositivo en la base de datos , luego de esto llama a ngOnInit para que
   * muestre el nuevo tipo de dato creado
   * @param tipo obejto que se envia a la base de datos para crear un nuevo tipo de dato
   */
  public crearTipoDipositivo(tipo: Tipo): void {
    console.log(tipo);
    this.service.crearTipoDispositivo(tipo).subscribe(respuesta => {
      console.log(respuesta);
      if (respuesta === 'tipo ya existe') {
        alert('Ya existe un tipo de dispositivo con este nombre');
      } else {
        this.ngOnInit();
      }
    });
  }

  /**
   * Edita un tipo de dipositivo ya creado y cambia los valores en la base de datos luego de esto llama a ngOnInit para que
   * muestre el nuevo tipo de dato creado
   * @param tipo edita el tipo de dato en la base de datos
   */
  public editarTipoDipositivo(tipo: Tipo): void {
    this.service.editarTipoDispositivo(tipo.nombre, tipo).subscribe(a => {
      console.log(a);
      if (a === 'tipo tiene registrado un dispositivo comprado') {
        alert('Error, ya contiene un dipositivo comprado')
      } else {
        this.ngOnInit();
      }
    });
  }

  /**
   * Elimina el un tipo de dispositivo enviado por dispositivo actual
   */
  public eliminarTipoDispositivo(): void {
    this.service.eliminarTipoDispositivo(this.tipoActual.nombre).subscribe(respuesta => {
      console.log(respuesta);
      if (respuesta === 'tipo tiene registrado un dispositivo comprado') {
        alert('No puede eliminar este tipo de dispositivo puesto tiene algun dispositivo que ya ha sido comprado por algun usuario');
      } else {
        this.ngOnInit();
      }
    });
  }

  /**
   * Toma el dispositivo actual entro del ngFor
   * @param tipo es el dato actual dentro del ng que se utiliza en otrar funciones
   */
  public tipoActualF(tipo: Tipo): void {
    this.tipoActual = tipo;
    this.dispositivosModeloConTipo(tipo);
  }

  /**
   * Obitne inftomacion del dispositivo modelo acutal
   * @param dipositivo dispositivo modelo dentro del ngFor
   */
  public obtenerInformacionItem(dipositivo: DispositivoModelo): void {
    this.oldDispositivocreado = dipositivo;
  }

  /**
   * Edita un un dispositivo para asociar algun tipo
   * @param dispositivoModelo
   */
  public editarDispositivo(dispositivoModelo: DispositivoModelo): void {
    console.log(dispositivoModelo);
    this.service.editarDipositivoModelo(dispositivoModelo.modelo, dispositivoModelo).subscribe(respuesta => {
      if (respuesta === 'el dispositivo ya ha sido comprado') {
        alert('No se puede editar este dispositivo puesto que ya ha sido comprado');
      } else {
        this.ngOnInit();
      }
    });
  }


  /**
   * Separa las lista de dispositivos en una nueva lista de todos los dispositivos que no tiene tipo
   */
  public dispositivosSinTipo(): void{
    this.listaDeModelosSinTipo = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listaDeModelos.length; i++){
      if (this.listaDeModelos[i].tipo === null ){
        this.listaDeModelosSinTipo.push(this.listaDeModelos[i]);
      }
    }
    console.log(this.listaDeModelosSinTipo);
  }

  /**
   * Separa la lista de dispositivos modelos aquellos que tiene el tipo asociado dentro de item
   * @param item tipo de dispositivo actual.
   */
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

  /**
   * Funcion en caso de que el administrador quiera un modelo , hace que el valor de este dispositivo modelo vuelva a ser nulo
   * @param dispositivoModelo dipositivo el cual va a ser desasociado
   */
  public desasociarDispositivo(dispositivoModelo: DispositivoModelo): void{
    dispositivoModelo.tipo = null;
    this.service.editarDipositivoModelo(dispositivoModelo.modelo, dispositivoModelo).subscribe(respuesta => {
      if (respuesta === 'el dispositivo ya ha sido comprado') {
        alert('No se puede editar este dispositivo puesto que ya ha sido comprado');
      } else {
        this.ngOnInit();
      }
    });
  }
}

