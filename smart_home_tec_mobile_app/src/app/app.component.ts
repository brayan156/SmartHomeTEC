import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Dispositivos', url: 'control-dispositivos-activos', icon: 'heart' },
    { title: 'Agregar dispositivo', url: 'agregar-nuevo', icon: 'heart' },
  ];
  constructor(public router: Router, public menu: MenuController) { }
  
  goToLogin() {
    this.router.navigateByUrl('login');
    this.menu.close();
  }
}
