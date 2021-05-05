import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {GoogleChartComponent, GoogleChartsModule} from 'angular-google-charts';
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
import { GestionPerfilComponent } from './Cliente/gestion-perfil/gestion-perfil.component';
import { RepMenDisComponent } from './Cliente/rep-men-dis/rep-men-dis.component';
import { RepDiaDispComponent } from './Cliente/rep-dia-disp/rep-dia-disp.component';
import { RepTipDispUsoComponent } from './Cliente/rep-tip-disp-uso/rep-tip-disp-uso.component';
import { VistaClienteComponent } from './Cliente/vista-cliente/vista-cliente.component';
import { NavUComponent } from './Cliente/nav-u/nav-u.component';
import { TiendaEnLineaUsuarioComponent } from './Cliente/tienda-en-linea-usuario/tienda-en-linea-usuario.component';

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
    GestionDistribuidoresComponent,
    GestionPerfilComponent,
    RepMenDisComponent,
    RepDiaDispComponent,
    RepTipDispUsoComponent,
    VistaClienteComponent,
    NavUComponent,
    TiendaEnLineaUsuarioComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    GoogleChartsModule,
    RouterModule.forRoot(rutas),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
