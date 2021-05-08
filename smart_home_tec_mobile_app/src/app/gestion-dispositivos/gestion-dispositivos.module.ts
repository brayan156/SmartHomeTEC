import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionDispositivosPageRoutingModule } from './gestion-dispositivos-routing.module';

import { GestionDispositivosPage } from './gestion-dispositivos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionDispositivosPageRoutingModule
  ],
  declarations: [GestionDispositivosPage]
})
export class GestionDispositivosPageModule {}
