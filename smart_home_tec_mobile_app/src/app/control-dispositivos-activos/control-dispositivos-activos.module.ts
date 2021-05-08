import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlDispositivosActivosPageRoutingModule } from './control-dispositivos-activos-routing.module';

import { ControlDispositivosActivosPage } from './control-dispositivos-activos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlDispositivosActivosPageRoutingModule
  ],
  declarations: [ControlDispositivosActivosPage]
})
export class ControlDispositivosActivosPageModule {}
