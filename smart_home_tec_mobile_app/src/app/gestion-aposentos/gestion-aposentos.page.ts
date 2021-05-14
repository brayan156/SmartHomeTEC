import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DbAPIService } from '../services/API/db-api.service';
import { DbServiceService } from '../services/db/db-service.service';
import { Aposento } from '../tablas-y-relaciones/aposento';
import { DispositivoAdquirido } from '../tablas-y-relaciones/dispositivoAdquirido';

@Component({
  selector: 'app-gestion-aposentos',
  templateUrl: './gestion-aposentos.page.html',
  styleUrls: ['./gestion-aposentos.page.scss'],
})
export class GestionAposentosPage implements OnInit {


  misDispositivosPorAposentos;
  misAposentos: Aposento[];
  @Input() aposento: Aposento = new Aposento();

  constructor(public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private db: DbServiceService,
    private dbAPI: DbAPIService,
  private router: Router) {

  }

  ngOnInit() {
    this.updateContenido();
  }

  dismiss() {
    this.modalController.dismiss();

  }

  /**
   * Esta es la funcion que se encarga de actualizar el contenido 
   * de toda la pagina
   */
  updateContenido() {
    this.misDispositivosPorAposentos = [];

    if (this.db.Sincronizar) {
      this.dbAPI.getMisDispositivosPorAposento(this.aposento.id).subscribe(dispositivos => {
        if (dispositivos.length != 0) {
          this.misDispositivosPorAposentos = dispositivos;
          console.log(dispositivos, "son mis dispositivos");

          this.dbAPI.getMisAposentos().subscribe(aposentos => {
            this.misAposentos = aposentos;
          })
        } else {
          this.presentAlert("No tiene dispositivos asociados.");
        }
      })
    } else {
      setTimeout(() => {
        this.db.getMisDispositivosPorAposento(this.aposento.id);
        this.misDispositivosPorAposentos = this.db.tmpQuery.value;
        this.misAposentos = this.db.getAposentosPorUsuario();
      }, 300);
    }
  }

  /**
   * Accion para el ion refresher
   * @param evento 
   */
  doRefresh(evento) {
    setTimeout(() => {
      this.updateContenido();
      evento.target.complete();
    }, 300)
  }


/**
 * Actualiza el aposento de un dispositivo
 * @param evento 
 * @param n_serie 
 * @param dispositivo 
 */
  updateAposentoDeDispositivo(evento, n_serie: number, dispositivo) {
    console.log(evento.detail, "son mis detalles");
    if (this.db.Sincronizar) {
      // let dispositivoAdquirido = new DispositivoAdquirido();
      // dispositivoAdquirido.idAposento = evento.detail.value;
      // dispositivoAdquirido.modelo = dispositivo.modelo;
      // dispositivoAdquirido.nSerie = n_serie;
      // dispositivoAdquirido.prendido = false;
      this.dbAPI.getDispositivoAdquirido(n_serie).subscribe(data => {
        data.idAposento = evento.detail.value;
        this.dbAPI.putDispositivoAdquirido(data).subscribe(data2 => {
          this.updateContenido();
        });
      })
      // this.dbAPI.putDispositivoAdquirido(dispositivoAdquirido).subscribe(data => {
        
      // });
    } else {
      this.db.updateDispositivoAdquirido(evento.detail.value, n_serie);
      this.updateContenido();
    }
  }

  /**
   * Muestra las acciones que se pueden hacer para un aposento
   */
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Editar ' + this.aposento.nombreCuarto,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar habitación',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
          this.deleteAposento();
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

  /**
   * Elimina el aposento de la base de datos
   */
  deleteAposento() {
    if (this.misDispositivosPorAposentos.length == 0) {
      if (this.db.Sincronizar) {
        this.dbAPI.deleteAposento(this.aposento.id).subscribe(data => {
          console.log(data);
          this.router.navigateByUrl('control-dispositivos-activos');
        });
      } else {
        this.db.deleteAposento(this.aposento.id);
        this.router.navigateByUrl('control-dispositivos-activos');
      }
      
    } else {
      this.presentAlert("Lo siento, tienes dispositivos asociados a este aposento :(");
    }
    
    
  }

  /**
   * Esta es la alerta que se usa para cambiar el nombre de un aposento
   */
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar nombre',
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
            console.log(data);
            this.updateNombreAposento( data.nuevonombre);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Actualiza el nombre de un aposento en la base
   * de datos.
   * @param nuevoNombre 
   */
  updateNombreAposento(nuevoNombre: string) {
    if (this.db.Sincronizar) {
      this.aposento.nombreCuarto = nuevoNombre;
      this.dbAPI.putAposento(this.aposento);
    } else {
      this.db.updatenombreAposento(this.aposento.id, nuevoNombre);
    }
  }

  /**
   * Una funcion generica para mostrar alertas.
   * @param message 
   */
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
