import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './AppComponent/app.component';
import {RouterModule} from '@angular/router';
import {rutas} from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './Administrador/nav/nav.component';
import { AgreInfoDispositivoComponent } from './Administrador/agre-info-dispositivo/agre-info-dispositivo.component';
import { GestionDeTiposDisComponent } from './Administrador/gestion-de-tipos-dis/gestion-de-tipos-dis.component';
import { DashboardComponent } from './Administrador/dashboard/dashboard.component';
import { TiendaEnLineaComponent } from './Administrador/tienda-en-linea/tienda-en-linea.component';
import { VistaAdminComponent } from './Administrador/vista-admin/vista-admin.component';
import { GestionDistribuidoresComponent } from './Administrador/gestion-distribuidores/gestion-distribuidores.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    AgreInfoDispositivoComponent,
    GestionDeTiposDisComponent,
    DashboardComponent,
    TiendaEnLineaComponent,
    VistaAdminComponent,
    GestionDistribuidoresComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(rutas),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
