import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  password: string;

  constructor(public alert: AlertController,
  public router: Router) { }

  ngOnInit() {
  }

  login(form) {
    this.router.navigateByUrl('control-dispositivos-activos')
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
