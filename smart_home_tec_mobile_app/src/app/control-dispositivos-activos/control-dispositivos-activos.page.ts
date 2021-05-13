import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { GestionAposentosPage } from '../gestion-aposentos/gestion-aposentos.page';
import { DbServiceService } from '../services/db/db-service.service';
import { Aposento } from '../tablas-y-relaciones/aposento';
import { DispositivoModelo } from '../tablas-y-relaciones/DispositivoModelo';

@Component({
  selector: 'app-control-dispositivos-activos',
  templateUrl: './control-dispositivos-activos.page.html',
  styleUrls: ['./control-dispositivos-activos.page.scss'],
})
export class ControlDispositivosActivosPage implements OnInit {

  dispositivosMios: any[];
  misAposentos: Aposento[] = [
    {
      Id: 2,
      NombreCuarto: "sala",
      IdCliente: 2,
    }
  ];
  misDispositivosPorAposentos = [];

  constructor(public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private db: DbServiceService) {

  }

  ngOnInit() {
    // this.actualizarContenido();

  }


  actualizarContenido() {
    this.dispositivosMios = this.db.getMisDispositivosModelo()
    this.misAposentos = this.db.getAposentosPorUsuario();
    setTimeout(() => {

    }, 300)
  }

  doRefresh(evento) {
    this.actualizarContenido();
    setTimeout(() => {
      evento.target.complete();
    }, 300)
  }



  async NuevaHabitacion() {
    const alert = await this.alertController.create({
      cssClass: 'alerta',
      header: 'Nuevo aposento',
      inputs: [
        {
          name: 'nuevoNombre',
          type: 'text',
          placeholder: 'Nombre'
        },

      ],
      buttons: [
        {
          text: 'Me arrepentí',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Listo',
          handler: data => {
            console.log("Ingresaste ", data.nuevoNombre);
            this.db.addAposento(data.nuevoNombre);
            this.misAposentos = this.db.getAposentosPorUsuario();
          }
        }
      ]
    });
    await alert.present();
  }

  async noHayContenidoAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No tienes dispositivos asociados :(',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.actualizarContenido();
          }
        }
      ]
    });
    await alert.present();
  }

  prenderApagar(evento, dispositivo) {
    console.log("El valor del evento del toggle es", evento.detail.checked);
    console.log("El valor de prendido del dispositivo es", dispositivo.Prendido);
    if (evento.detail.checked != 1) {
      this.db.prenderDispositivo(dispositivo.N_serie);
    } else {
      this.db.apagarDispositivo(dispositivo.N_serie);
    }
    this.actualizarContenido();
  }

  async presentModal(aposento: Aposento) {
    // let tmp;
    // this.db.getMisDispositivosPorAposento(aposento.Id);

    // setTimeout(async () => {
    //   this.misDispositivosPorAposentos = this.db.tmpQuery.value;
    //   console.log(this.misDispositivosPorAposentos.length, " es la longitud de la lista");
    //   tmp = (this.misDispositivosPorAposentos.length != 0) ? true : false;
    let tmp = true;
      if (tmp) {
        const modal = await this.modalController.create({
          component: GestionAposentosPage,
          componentProps: {
            aposento: aposento,
          }
        });
        return await modal.present();
      } else {
        this.noHayContenidoAlert();
      }
  // }, 300)

  }

}

