import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbServiceService } from '../services/db/db-service.service';
import { Cliente } from '../tablas-y-relaciones/cliente';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  password: string;
  clientes: Cliente[] = [];

  constructor(public alert: AlertController,
    public router: Router,
    private db: DbServiceService) {
    this.db.seedDatabase();
    }

  ngOnInit() {

    // this.db.getDatabaseState().subscribe(rdy => {
    //   if (rdy) {
    //     this.db.getClientes().subscribe(devs => {
    //       this.clientes = devs;
    //     })
    //     //this.products = this.db.getProducts();
    //   }
    // });
  }

  login() {
    this.db.resetUsuario();
    let tmp;
    this.db.validarCliente(this.correo, this.password);
    setTimeout(() => {
      tmp = (this.db.Usuario.value.length != 0 ) ? true : false;
      if (tmp) {
        this.router.navigateByUrl('control-dispositivos-activos');
      } else {
        this.presentAlert();
      }
    }, 400);
    

  }
  /**
   * En caso de que la validacion del usuario falle, 
   * se despliega una alerta.
   */
  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Datos inválidos',
      subHeader: 'Por favor corrija sus datos',
      buttons: ['OK']
    });

    await alert.present();
  }

}
