import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DbServiceService } from '../services/db/db-service.service';
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
    this.aposentos = this.db.getAposentosPorUsuario();
    this.tipos = this.db.getTipos();
    this.dispositivosModelo = this.db.getDispositivosModelo();
  }

  // Recibe la informacion y la envia
  nuevoDispositivo() {
    console.log(this.N_serie);
    console.log(this.Descripcion, this.Marca, this.Tipo);



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
        if (!this.db.coincideInformacion(this.N_serie, this.Marca, this.Descripcion, this.Tipo)) {
          this.presentAlert("La información no coincide con la base de datos.");
        } else {
          this.db.addClienteHaUsado(this.N_serie);
          this.db.updateDispositivoAdquirido(this.getIdAposento(), this.N_serie);
          this.presentConfirmacion("Tu dispositivo fue agregado exitosamente.");
        }
      }
    });



  };

  getIdAposento() {
    let result = null;
    this.aposentos.forEach(aposento => {
      if (aposento.NombreCuarto == this.Aposento) {
        result = aposento.Id;
      }
    });
    return result;
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
