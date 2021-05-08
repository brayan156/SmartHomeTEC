import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionDispositivosPage } from './gestion-dispositivos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionDispositivosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionDispositivosPageRoutingModule {}
