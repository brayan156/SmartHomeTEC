import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {NavComponent} from './Administrador/nav/nav.component';
import {AgreInfoDispositivoComponent} from './Administrador/agre-info-dispositivo/agre-info-dispositivo.component';
import {GestionDeTiposDisComponent} from './Administrador/gestion-de-tipos-dis/gestion-de-tipos-dis.component';
import {DashboardComponent} from './Administrador/dashboard/dashboard.component';



export let rutas: Routes;
rutas = [ {path: '', component: LoginComponent},
  { path: 'administrador', component: NavComponent,
  children: [
    {path: '', component: NavComponent},
    {path: 'informacionDispositivos', component: AgreInfoDispositivoComponent},
    {path: 'gestionDeTiposDeDispositivos', component: GestionDeTiposDisComponent},
    {path: 'gestionDeDistribuidores', component: GestionDeTiposDisComponent},
    {path: 'gestionDeTiendaEnLineaYDistribuidores', component: GestionDeTiposDisComponent},
    {path: 'Dashboard', component: DashboardComponent},


  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(rutas)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
