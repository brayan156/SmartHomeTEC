import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Dispositivos', url: 'control-dispositivos-activos', icon: 'heart' },
    { title: 'Aposentos', url: 'gestion-aposentos', icon: 'heart' },
    { title: 'Agregar dispositivo', url: 'gestion-dispositivos', icon: 'heart' },
  ];
  constructor() {}
}
