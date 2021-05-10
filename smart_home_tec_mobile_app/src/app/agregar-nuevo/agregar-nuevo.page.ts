import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DbServiceService } from '../services/db/db-service.service';
import { DispositivoService } from '../services/db/dispositivo.service';

@Component({
  selector: 'app-agregar-nuevo',
  templateUrl: './agregar-nuevo.page.html',
  styleUrls: ['./agregar-nuevo.page.scss'],
})
export class AgregarNuevoPage implements OnInit {

  Descripcion: string;
  Tipo: string;
  Consumo: string;
  Marca: string;
  N_serie: number;
  Aposento: string;
  registro = {};
  constructor(private db: DbServiceService,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  // Recibe la informacion y la envia
  nuevoDispositivo() {
    console.log(this.N_serie);

    //Preguntamos si el numero de serie existe
    if (!this.db.existeDispositivo(this.N_serie)) {
      this.presentAlert("Hagame el favor e ingrese un número de serie válido.");
    }

    //Preguntamos si el numero de serie esta asociado
    else if (!this.db.fueUsadoDispositivo(this.N_serie)) {
      this.presentAlert("El dispositivo ya está asociado a un cliente.");
    }

    //Preguntamos si coinciden los parametros marca-tipo-N_serie-descripcion
    else if (!this.db.coincideInformacion(this.N_serie, this.Marca, this.Descripcion, this.Tipo)) {
      this.presentAlert("La información no coincide con la base de datos.");
    }

    // Asociamos N_serie en las tablas con el cliente y el aposento
    else {
      this.db.addClienteHaUsado(this.N_serie);
      this.presentConfirmacion("Tu dispositivo fue agregado exitosamente.");
  
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

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
