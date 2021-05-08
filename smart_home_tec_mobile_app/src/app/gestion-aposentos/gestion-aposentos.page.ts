import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-aposentos',
  templateUrl: './gestion-aposentos.page.html',
  styleUrls: ['./gestion-aposentos.page.scss'],
})
export class GestionAposentosPage implements OnInit {


  constructor(public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Editar X habitación',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar habitación',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Cambiar nombre',
        icon: 'pencil',
        handler: () => {
          this.presentAlertPrompt();
          console.log('Favorite clicked');
        }
        }, {
          text: 'Definir como cocina',
        icon: 'assets/rooms/SVG/kitchen_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
        }, {
          text: 'Definir como sala',
        icon: 'assets/rooms/SVG/living_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
        }, {
          text: 'Definir como habitación',
        icon: 'assets/rooms/SVG/bed_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
        }, {
          text: 'Definir como garaje',
        icon: 'assets/rooms/SVG/garage_room.svg',
        handler: () => {
          console.log('Favorite clicked');
        }
        },{
          text: 'Definir como otro',
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

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar nombre',
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
          handler:data => {
            console.log(data);
          }
        }
      ]
    });

    await alert.present();
  }


}
