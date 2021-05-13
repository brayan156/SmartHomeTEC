import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DbServiceService } from '../services/db/db-service.service';
import { Aposento } from '../tablas-y-relaciones/aposento';

@Component({
  selector: 'app-gestion-aposentos',
  templateUrl: './gestion-aposentos.page.html',
  styleUrls: ['./gestion-aposentos.page.scss'],
})
export class GestionAposentosPage implements OnInit {

  misDispositivosPorAposentos = [
    {
      mes_fin_garantia: 3,
      ano_fin_garantia: 3,
      n_serie: 2,
      prendido: 1,
      imagen: "https://cdn57.androidauthority.net/wp-content/uploads/2020/11/aukey-smart-lamp-990x675.jpg",
      modelo: "Lamp3000"
    }
  ];
  misAposentos: Aposento[] = [];
  @Input() aposento: Aposento;

  constructor(public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private db: DbServiceService) {
    // this.updateContenido();
  }

  ngOnInit() {
    // this.updateContenido();
  }

  dismiss() {
    this.modalController.dismiss();
    console.log(this.misDispositivosPorAposentos.length, "es la logingutd en dismiss");
    console.log(this.misAposentos.length, "es la logingutd en dismiss")

  }

  updateContenido() {
    setTimeout(() => {
      this.db.getMisDispositivosPorAposento(this.aposento.Id);
      this.misDispositivosPorAposentos = this.db.tmpQuery.value;
      this.misAposentos = this.db.getAposentosPorUsuario();
    }, 300)

  }

  doRefresh(evento) {
    setTimeout(() => {
      this.updateContenido();


      evento.target.complete();
    }, 300)
  }

  updateAposentoDeDispositivo(evento, n_serie: number) {
    console.log(evento.detail.value, "son mis detalles");
    this.db.updateDispositivoAdquirido(evento.detail.value, n_serie);
    this.updateContenido();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Editar ' + this.aposento.NombreCuarto,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar habitación',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          this.db.deleteAposento(this.aposento.Id);
        }
      }, {
        text: 'Cambiar nombre',
        icon: 'pencil',
        handler: () => {
          this.presentAlertPrompt();
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
          handler: data => {
            console.log(data);
            this.db.updateNombreAposento(this.aposento.Id, data);
          }
        }
      ]
    });

    await alert.present();
  }


}
