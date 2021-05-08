import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarNuevoPageRoutingModule } from './agregar-nuevo-routing.module';

import { AgregarNuevoPage } from './agregar-nuevo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarNuevoPageRoutingModule
  ],
  declarations: [AgregarNuevoPage]
})
export class AgregarNuevoPageModule {}
