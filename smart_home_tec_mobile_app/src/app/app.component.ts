import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { DbServiceService } from './services/db/db-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  correo;
  public appPages = [
    { title: 'Dispositivos', url: 'control-dispositivos-activos', icon: 'heart' },
    { title: 'Agregar dispositivo', url: 'agregar-nuevo', icon: 'heart' },
  ];
  constructor(public router: Router, public menu: MenuController,
    private db: DbServiceService) {
  }
  
  goToLogin() {
    this.db.resetMyId();
    this.router.navigateByUrl('login');
    this.menu.close();
  }
}
