import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { GestionAposentosPage } from '../gestion-aposentos/gestion-aposentos.page';
import { DbServiceService } from '../services/db/db-service.service';
import { DispositivoAdquirido } from '../tablas-y-relaciones/dispositivoAdquirido';
import { DispositivoModelo } from '../tablas-y-relaciones/DispositivoModelo';

@Component({
  selector: 'app-control-dispositivos-activos',
  templateUrl: './control-dispositivos-activos.page.html',
  styleUrls: ['./control-dispositivos-activos.page.scss'],
})
export class ControlDispositivosActivosPage implements OnInit {

  dispositivosMios: DispositivoModelo[];

  constructor(public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private db: DbServiceService) {
    this.updateMisDispositivosModelo();

  }

  ngOnInit() {
    this.updateMisDispositivosModelo();

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

      evento.target.complete();
    }, 1000)
  }



  async nombreNuevaHabitacion() {
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
            console.log(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Crear habitación',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Definir nombre',
        icon: 'pencil',
        handler: () => {
          this.nombreNuevaHabitacion();
          console.log('Favorite clicked');
        }
      }, {
        text: 'Guardar como cocina',
        icon: 'assets/rooms/SVG/kitchen_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Guardar como sala',
        icon: 'assets/rooms/SVG/living_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Guardar como habitación',
        icon: 'assets/rooms/SVG/bed_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Guardar como garaje',
        icon: 'assets/rooms/SVG/garage_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Guardar como otro',
        icon: 'assets/rooms/SVG/other_room.svg',
        handler: () => {
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

  async presentModal() {
    const modal = await this.modalController.create({
      component: GestionAposentosPage,
    });
    return await modal.present();
  }





}

