import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionAposentosPageRoutingModule } from './gestion-aposentos-routing.module';

import { GestionAposentosPage } from './gestion-aposentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionAposentosPageRoutingModule
  ],
  declarations: [GestionAposentosPage]
})
export class GestionAposentosPageModule {}
