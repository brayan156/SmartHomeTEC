import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { GestionAposentosPage } from '../gestion-aposentos/gestion-aposentos.page';
import { DbServiceService } from '../services/db/db-service.service';
import { Aposento } from '../tablas-y-relaciones/aposento';
import { DispositivoAdquirido } from '../tablas-y-relaciones/dispositivoAdquirido';
import { DispositivoModelo } from '../tablas-y-relaciones/DispositivoModelo';

@Component({
  selector: 'app-control-dispositivos-activos',
  templateUrl: './control-dispositivos-activos.page.html',
  styleUrls: ['./control-dispositivos-activos.page.scss'],
})
export class ControlDispositivosActivosPage implements OnInit {

  dispositivosMios: DispositivoModelo[];
  misAposentos: Aposento[];
  misDispositivosPorAposentos = [];

  constructor(public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private db: DbServiceService) {
    this.updateMisDispositivosModelo();

  }

  ngOnInit() {
    this.updateMisDispositivosModelo();
    this.misAposentos = this.db.getAposentos();

  }

  updateMisDispositivosModelo() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getMisDispositivosModelo().subscribe(data => {
          this.dispositivosMios=[];
          this.dispositivosMios = data;
        })
        //this.products = this.db.getProducts();
      }
    });
  }

  doRefresh(evento) {
    setTimeout(() => {
      this.updateMisDispositivosModelo();
      this.misAposentos = this.db.getAposentos();

      evento.target.complete();
    }, 1000)
  }



  async NuevaHabitacion() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
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
            this.misAposentos = this.db.getAposentos();
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
          text: 'Me arrepentí',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });
    await alert.present();
  }


  async presentModal( aposento: Aposento) {
    this.misDispositivosPorAposentos = this.db.getMisDispositivosPorAposento(aposento.Id);
    setTimeout(async () => {
      if (this.misDispositivosPorAposentos.length != 0){
        const modal = await this.modalController.create({
          component: GestionAposentosPage,
          componentProps: {
            aposento: this.misDispositivosPorAposentos
          }
        });
        return await modal.present();
      } else {
        this.noHayContenidoAlert();
      }
    }, 2000)
    
  }






}

