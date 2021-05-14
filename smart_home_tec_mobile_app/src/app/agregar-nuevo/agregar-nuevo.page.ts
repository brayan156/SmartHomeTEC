import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbAPIService } from '../services/API/db-api.service';
import { DbServiceService } from '../services/db/db-service.service';
import { Aposento } from '../tablas-y-relaciones/aposento';
import { Dispositivomodelo } from '../tablas-y-relaciones/Dispositivomodelo';
import { tipo } from '../tablas-y-relaciones/tipo';

@Component({
  selector: 'app-agregar-nuevo',
  templateUrl: './agregar-nuevo.page.html',
  styleUrls: ['./agregar-nuevo.page.scss'],
})
export class AgregarNuevoPage implements OnInit {

  descripcion: string;
  tipo: string;
  Consumo: string;
  marca: string;
  N_serie: number;
  Aposento: string;


  registro = {};
  tipos: tipo[] = [];
  aposentos: Aposento[] = [];
  dispositivosmodelo: Dispositivomodelo[] = [];
  tmpQuery = [];

  constructor(private db: DbServiceService,
    private alertController: AlertController,
    private dbAPI: DbAPIService,
  private router: Router) { }

  ngOnInit() {
    this.actualizarContenido();
  }

/**
 * Actualiza el contenido de toda la pagina.
 */
  actualizarContenido() {
    if (this.db.Sincronizar) {
      this.dbAPI.getMisAposentos().subscribe(data => {
        this.aposentos = data;
      });
      this.dbAPI.getTipos().subscribe(data => {
        this.tipos = data;
      });
      this.dbAPI.getDispositivosModelo().subscribe(data => {
        this.dispositivosmodelo = data;
      });
    } else {
      this.aposentos = this.db.getAposentosPorUsuario();
      this.tipos = this.db.gettipos();
      this.dispositivosmodelo = this.db.getDispositivosmodelo();
    }
  }

  /**
   * Funcion para asociar dispositivo a la base de datos.
   */
  nuevoDispositivo() {
    if (this.db.Sincronizar) {
      let objeto = {
        descripcion: this.descripcion,
        tipo: this.tipo,
        marca: this.marca,
        n_serie: this.N_serie,
        consumo: this.Consumo,
        aposento: this.getidAposento()
      };
      console.log(objeto);
      this.dbAPI.nuevoDispositivo(objeto).subscribe(data => {
        if (data == "dispositivo no existe") this.presentAlert("Hagame el favor e ingrese un número de serie válido.");
        else if (data == "dispositivo ya ha sido registrado") this.presentAlert("El dispositivo ya está asociado a un cliente.");
        else if (data == "dispositivo registrado con exito") this.presentConfirmacion("Tu dispositivo fue agregado exitosamente.");
        else if (data == "datos invalidos") this.presentAlert("La información no coincide con la base de datos.");
        this.router.navigateByUrl('control-dispositivos-activos');
      });
    } else {
      this.nuevoDispositivoLocal();
      this.router.navigateByUrl('control-dispositivos-activos');
    }
  }

  /**
   * Crea un dispositivo en la base de datos local
   */
  nuevoDispositivoLocal() {
    console.log(this.N_serie);
    console.log(this.descripcion, this.marca, this.tipo);



    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        // Preguntamos si el numero de serie existe
        if (!this.db.existeDispositivo(this.N_serie)) {
          this.presentAlert("Hagame el favor e ingrese un número de serie válido.");
        }
      }
    });

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        // Preguntamos si el numero de serie esta asociado
        if (!this.db.fueUsadoDispositivo(this.N_serie)) {
          this.presentAlert("El dispositivo ya está asociado a un cliente.");
        }
      }
    });

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        //Preguntamos si coinciden los parametros marca-tipo-N_serie-descripcion
        if (!this.db.coincideInformacion(this.N_serie, this.marca, this.descripcion, this.tipo)) {
          this.presentAlert("La información no coincide con la base de datos.");
        } else {
          this.db.addClienteHaUsado(this.N_serie);
          this.db.updateDispositivoAdquirido(this.getidAposento(), this.N_serie);
          this.presentConfirmacion("Tu dispositivo fue agregado exitosamente.");
        }
      }
    });



  };

  /**
   * Retorna el id de un aposento
   * @returns 
   */
  getidAposento() {
    let result = null;
    this.aposentos.forEach(aposento => {
      if (aposento.nombreCuarto == this.Aposento) {
        result = aposento.id;
      }
    });
    return result;
  }

  /**
   * Una funcion generica para mostrar un mensaje en una alerta
   * @param message 
   */
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Alerta de confirmacion
   * @param message 
   */
  async presentConfirmacion(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Buenísimo',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
