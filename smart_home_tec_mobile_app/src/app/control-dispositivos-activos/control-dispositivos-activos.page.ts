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

  // dispositivosMios: any[] = [
  //   {
  //     Modelo: "Lamp3000",
  //     Marca: "Xiaomi",
  //     ConsumoElectrico: "30",
  //     Tipo: "Lamp",
  //     Imagen: "https://images.thdstatic.com/productImages/9525a3b0-8fe3-4024-a93b-ea6e1460bb19/svn/white-energizer-colored-light-bulbs-ecom-1062-pp4-64_1000.jpg",
  //     N_serie: 3,
  //     Prendido: 1,
  //     mes_fin_garantia: 4,
  //     ano_fin_garantia: 0,
  //   }
  // ];
  // misAposentos: Aposento[] = [
  //   {
  //     Id: 2,
  //     NombreCuarto: "sala",
  //     IdCliente: 2,
  //   }
  // ];
  dispositivosMios = [];
  misAposentos: Aposento[] = []
  misDispositivosPorAposentos = [];
  dispositivosSinAposento = [];

  constructor(public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private db: DbServiceService) {
    this.actualizarContenido();
  }

  ngOnInit() {
    this.actualizarContenido();

  }


  actualizarContenido() {
    this.db.getMisDispositivosModelo();
    this.dispositivosMios = this.db.misDispostivosModelo.value;
    this.misAposentos = this.db.getAposentosPorUsuario();
    setTimeout(() => {
      // console.log("voy a printear este dipositivo", this.dispositivosMios[0].Tipo);
    }, 300)
  }

  updateAposentoDeDispositivo(evento, n_serie: number) {
    console.log(evento.detail.value, "son mis detalles");
    this.db.updateDispositivoAdquirido(evento.detail.value, n_serie);
    this.actualizarContenido();
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


  async showInfoDispositivo(dispositivo) {
    let textoPrenderApagar = ''
    if (dispositivo.Prendido == 1) {
      textoPrenderApagar = 'Apagar'
    } else {
      textoPrenderApagar = 'Prender'
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Información de ' + dispositivo.Modelo,
      cssClass: 'my-custom-class',
      buttons: [
        //{
        //   text: 'Eliminar habitación',
        //   role: 'destructive',
        //   icon: 'trash',
        //   handler: () => {
        //     console.log('Delete clicked');
        //     this.db.deleteAposento(this.aposento.Id);
        //   }
        // }, 
        {
          text: textoPrenderApagar,
          icon: 'contrast',
          handler: () => {
            if (dispositivo.Prendido == 1) {
              this.db.apagarDispositivo(dispositivo.N_serie);
            } else {
              this.db.prenderDispositivo(dispositivo.N_serie);
            }

          }
        },
      {
          text: 'Asociar a otro usuario',
          icon: 'pencil',
          handler: () => {
            this.presentAlertPrompt(dispositivo);
            console.log('Favorite clicked');
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentAlertPrompt(dispositivo) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Asociar a otro usuario',
      subHeader: dispositivo.Modelo,
      message: 'Tiempo restante de garantia: ' + dispositivo.ano_fin_garantia + ' meses y ' + dispositivo.ano_fin_garantia + ' años.',
      inputs: [
        {
          name: 'nuevoId',
          type: 'number',
          placeholder: 'Id del nuevo cliente'
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
            console.log(data);
            this.db.asociarDispositivoANuevoCliente(dispositivo.N_serie, data.nuevoId);
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
    let tmp;
    this.db.getMisDispositivosPorAposento(aposento.Id);

    setTimeout(async () => {
      this.misDispositivosPorAposentos = this.db.tmpQuery.value;
      console.log(this.misDispositivosPorAposentos.length, " es la longitud de la lista");
      tmp = (this.misDispositivosPorAposentos.length != 0) ? true : false;
    // let tmp = true;
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
    }, 300)

  }

}

