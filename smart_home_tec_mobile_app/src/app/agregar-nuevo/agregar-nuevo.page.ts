import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DbServiceService } from '../services/db/db-service.service';
import { DispositivoService } from '../services/db/dispositivo.service';
import { Aposento } from '../tablas-y-relaciones/aposento';
import { DispositivoModelo } from '../tablas-y-relaciones/DispositivoModelo';
import { Tipo } from '../tablas-y-relaciones/tipo';

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
  tipos: Tipo[] = [];
  aposentos: Aposento[] = [];
  dispositivosModelo: DispositivoModelo[] = [];
  tmpQuery = [];

  constructor(private db: DbServiceService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.aposentos = this.db.getAposentos();
    this.tipos = this.db.getTipos();
    this.dispositivosModelo = this.db.getDispositivosModelo();
  }

  // Recibe la informacion y la envia
  nuevoDispositivo() {
    console.log(this.N_serie);
    console.log(this.Descripcion, this.Marca, this.Tipo);



    //Preguntamos si el numero de serie existe
    this.db.existeDispositivo(this.N_serie).subscribe(tmpQuery => {
      if (tmpQuery.length != 0) {
        console.log(tmpQuery.length);
        //Preguntamos si el numero de serie esta asociado
        this.db.fueUsadoDispositivo(this.N_serie).subscribe(tmpQuery2 => {
          if (tmpQuery2.length != 0) {
            this.presentAlert("El dispositivo ya está asociado a un cliente.");
          } else {
            // console.log("tmpQuery2");
            // //Preguntamos si coinciden los parametros marca-tipo-N_serie-descripcion
            // this.db.coincideInformacion(this.N_serie, this.Marca, this.Descripcion, this.Tipo).subscribe(tmpQuery3 => {


            //   if (tmpQuery3.length != 0) {
            //     if (this.Marca == tmpQuery3[0].marca && this.Descripcion == tmpQuery3[0].descripcion && this.Tipo == tmpQuery3[0].tipo) {
            //       // Asociamos N_serie en las tablas con el cliente y el aposento
            //       this.db.addClienteHaUsado(this.N_serie);
            //       this.presentConfirmacion("Tu dispositivo fue agregado exitosamente.");
            //     } 
            //   } else {
            //     this.presentAlert("La información no coincide con la base de datos.");
            //   }
              
            // })

            if (this.db.coincideInformacion(this.N_serie, this.Marca, this.Descripcion, this.Tipo)) {
              this.presentAlert("Lo lograste.");
            }
          }
        })
      } else {
        this.presentAlert("Hagame el favor e ingrese un número de serie válido.");
      }

    });



    //Preguntamos si el numero de serie existe
    // if (!this.db.existeDispositivo(this.N_serie)) {
    //   this.presentAlert("Hagame el favor e ingrese un número de serie válido.");
    // }

    //Preguntamos si el numero de serie esta asociado
    // else if (!this.db.fueUsadoDispositivo(this.N_serie)) {
    //   this.presentAlert("El dispositivo ya está asociado a un cliente.");
    // }

    // //Preguntamos si coinciden los parametros marca-tipo-N_serie-descripcion
    // else if (!this.db.coincideInformacion(this.N_serie, this.Marca, this.Descripcion, this.Tipo)) {
    //   this.presentAlert("La información no coincide con la base de datos.");
    // }

    // Asociamos N_serie en las tablas con el cliente y el aposento
    // else {
    //   this.db.addClienteHaUsado(this.N_serie);
    //   this.presentConfirmacion("Tu dispositivo fue agregado exitosamente.");

    // }
  
};

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
