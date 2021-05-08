import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarNuevoPage } from './agregar-nuevo.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarNuevoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarNuevoPageRoutingModule {}
