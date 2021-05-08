import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionAposentosPage } from './gestion-aposentos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionAposentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionAposentosPageRoutingModule {}
