import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { GestionAposentosPage } from '../gestion-aposentos/gestion-aposentos.page';
import { DbAPIService } from '../services/API/db-api.service';
import { DbServiceService } from '../services/db/db-service.service';
import { Aposento } from '../tablas-y-relaciones/aposento';
import { DispositivoAdquirido } from '../tablas-y-relaciones/dispositivoAdquirido';
import { Dispositivomodelo } from '../tablas-y-relaciones/Dispositivomodelo';

@Component({
  selector: 'app-control-dispositivos-activos',
  templateUrl: './control-dispositivos-activos.page.html',
  styleUrls: ['./control-dispositivos-activos.page.scss'],
})
export class ControlDispositivosActivosPage implements OnInit {

  // dispositivosMios: any[] = [
  //   {
  //     modelo: "Lamp3000",
  //     marca: "Xiaomi",
  //     consumoElectrico: "30",
  //     tipo: "Lamp",
  //     imagen: "https://images.thdstatic.com/productImages/9525a3b0-8fe3-4024-a93b-ea6e1460bb19/svn/white-energizer-colored-light-bulbs-ecom-1062-pp4-64_1000.jpg",
  //     N_serie: 3,
  //     prendido: 1,
  //     mes_fin_garantia: 4,
  //     ano_fin_garantia: 0,
  //   }
  // ];
  // misAposentos: Aposento[] = [
  //   {
  //     Id: 2,
  //     nombreCuarto: "sala",
  //     idCliente: 2,
  //   }
  // ];
  dispositivosMios = [];
  misAposentos: Aposento[] = []
  misDispositivosPorAposentos = [];
  dispositivosSinAposento = [];

  constructor(public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private db: DbServiceService,
    private dbAPI: DbAPIService) {
    this.actualizarContenido();
  }

  ngOnInit() {
    this.actualizarContenido();

  }


  actualizarContenido() {
    if (this.db.Sincronizar) {
      this.dbAPI.getMisAposentos().subscribe(data => {
        if (data.length != 0) {
          this.misAposentos = data;
          this.dbAPI.getMisDispositivos().subscribe(dispositivos => {
            if (dispositivos.length != 0) {
              this.dispositivosMios = dispositivos;
              console.log(dispositivos, "son mis dispositivos");
            } else {
              this.presentAlert("No tiene dispositivos asociados.");
            }
          })
        } else {
          this.presentAlert("No tiene aposentos asociados.");
        }

      })
    } else {
      this.db.getMisDispositivosmodelo();
      this.dispositivosMios = this.db.misDispostivosmodelo.value;
      this.misAposentos = this.db.getAposentosPorUsuario();
      setTimeout(() => {
        if (this.misAposentos.length == 0) {
          this.presentAlert("No tiene aposentos asociados.");
        }
      }, 300)
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

  updateAposentoDeDispositivo(evento, dispositivo) {
    console.log(evento.detail.value, "son mis detalles");
    if (this.db.Sincronizar) {
      this.dbAPI.getDispositivoAdquirido(dispositivo.n_serie).subscribe(data => {
        data.idAposento = evento.detail.value;
        this.dbAPI.putDispositivoAdquirido(data).subscribe(data2 => {

        });
      })

    } else {
      this.db.updateDispositivoAdquirido(evento.detail.value, dispositivo.n_serie);
    }
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
          name: 'nuevonombre',
          type: 'text',
          placeholder: 'nombre'
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
            console.log("Ingresaste ", data.nuevonombre);
            let existe = false;
            this.misAposentos.forEach(elemento => {
              if (elemento.nombreCuarto == data.nuevonombre) {
                this.presentAlert("Este nombre ya está registrado.");
                existe = true;
              }
            });
            if (!existe) {
              if (this.db.Sincronizar) {
                this.dbAPI.addAposento(data.nuevonombre).subscribe(data => {
                  this.actualizarContenido();
                });
              } else {
                this.db.addAposento(data.nuevonombre);
                this.actualizarContenido();
              }
            }

          }
        }
      ]
    });
    await alert.present();
  }

  confirmarSincronizacion() {
    if (this.db.Sincronizar) {
      this.presentarAlertConfirmacionSinc();
    } else {
      this.presentarAlertConfirmacionNoSinc();

    }

  }

  async presentarAlertConfirmacionSinc() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Aló!',
      message: '¿Está seguro de que desea desactivar sincronizacion? :O',
      buttons: [
        {
          text: 'NO :O',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si xD',
          handler: () => {
            this.db.seedDatabase();
            this.actualizarContenido();
            this.db.Sincronizar = false;
          }
        }
      ]
    });

    await alert.present();
  }

  async presentarAlertConfirmacionNoSinc() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Aló!',
      message: '¿Está seguro de que desea activar sincronizacion? :O',
      buttons: [
        {
          text: 'NO :O',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si xD',
          handler: () => {
            this.db.SincronizarTodo();
            this.db.Sincronizar = true;
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
    if (dispositivo.prendido == 1) {
      textoPrenderApagar = 'Apagar'
    } else {
      textoPrenderApagar = 'Prender'
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Información de ' + dispositivo.modelo,
      cssClass: 'my-custom-class',
      buttons: [
        //{
        //   text: 'Eliminar habitación',
        //   role: 'destructive',
        //   icon: 'trash',
        //   handler: () => {
        //     console.log('Delete clicked');
        //     this.db.deleteAposento(this.aposento.id);
        //   }
        // }, 
        {
          text: textoPrenderApagar,
          icon: 'contrast',
          handler: () => {
            if (dispositivo.prendido == 1) {
              this.apagarDispositivo(dispositivo.n_serie);
            } else {
              this.prenderDispositivo(dispositivo.n_serie);
            }
            this.actualizarContenido();

          }
        },
        {
          text: 'Asociar a otro usuario',
          icon: 'pencil',
          handler: () => {
            this.presentarAlertaDeNuevoAsocie(dispositivo);
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

  prenderDispositivo(n_serie: number) {
    if (this.db.Sincronizar) {
      this.dbAPI.prenderDispositivo(n_serie).subscribe(data => {

      });
    } else {
      this.db.prenderDispositivo(n_serie);
    }
  }

  apagarDispositivo(n_serie: number) {
    if (this.db.Sincronizar) {
      this.dbAPI.apagarDispositivo(n_serie).subscribe(data => {
        this.actualizarContenido();
      });
    } else {
      this.db.apagarDispositivo(n_serie);
    }
  }

  async presentarAlertaDeNuevoAsocie(dispositivo) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Asociar a otro usuario',
      subHeader: dispositivo.modelo,
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
            this.asociarDispositivoANuevoCliente(dispositivo.n_serie, data.nuevoId);
          }
        }
      ]
    });

    await alert.present();
  }

  asociarDispositivoANuevoCliente(n_serie: number, idCliente: number) {
    if (this.db.Sincronizar) {
      this.dbAPI.asociarDispositivoANuevoCliente(n_serie, idCliente).subscribe(data => {
        this.actualizarContenido();
      });
    } else {
      this.db.asociarDispositivoANuevoCliente(n_serie, idCliente);
      this.actualizarContenido();
    }
  }

  // getMisDispositivosPorAposento(aposento: Aposento) {
  //   if (this.db.Sincronizar) {
  //     this.dbAPI.getMisDispositivosPorAposento(aposento.id).subscribe(data => {
  //       this.misDispositivosPorAposentos = data;
  //     })
  //   } else {
  //     this.getMisDispositivosPorAposentoLocal(aposento);
  //   }
  // }

  // getMisDispositivosPorAposentoLocal(aposento: Aposento) {
  //   let tmp;
  //   this.db.getMisDispositivosPorAposento(aposento.id);

  //   setTimeout(async () => {
  //     this.misDispositivosPorAposentos = this.db.tmpQuery.value;
  //     console.log(this.misDispositivosPorAposentos.length, " es la longitud de la lista");
  //     tmp = (this.misDispositivosPorAposentos.length != 0) ? true : false;
  //   // let tmp = true;
  //   if (tmp) {
  //     this.presentModal(aposento)
  //   } else {
  //     this.noHayContenidoAlert();
  //   }
  //   }, 300)
  // }

  async presentModal(aposento: Aposento) {
    const modal = await this.modalController.create({
      component: GestionAposentosPage,
      componentProps: {
        aposento: aposento,
      }
    });
    return await modal.present();
  }

}

