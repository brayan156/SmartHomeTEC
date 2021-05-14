import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {NavComponent} from './Administrador/nav/nav.component';
import {AgreInfoDispositivoComponent} from './Administrador/agre-info-dispositivo/agre-info-dispositivo.component';
import {GestionDeTiposDisComponent} from './Administrador/gestion-de-tipos-dis/gestion-de-tipos-dis.component';
import {DashboardComponent} from './Administrador/dashboard/dashboard.component';
import {VistaAdminComponent} from './Administrador/vista-admin/vista-admin.component';
import {TiendaEnLineaComponent} from './Administrador/tienda-en-linea/tienda-en-linea.component';
import {GestionDistribuidoresComponent} from './Administrador/gestion-distribuidores/gestion-distribuidores.component';
import {VistaClienteComponent} from './Cliente/vista-cliente/vista-cliente.component';
import {NavUComponent} from './Cliente/nav-u/nav-u.component';
import {GestionPerfilComponent} from './Cliente/gestion-perfil/gestion-perfil.component';
import {RepDiaDispComponent} from './Cliente/rep-dia-disp/rep-dia-disp.component';
import {RepMenDisComponent} from './Cliente/rep-men-dis/rep-men-dis.component';
import {RepTipDispUsoComponent} from './Cliente/rep-tip-disp-uso/rep-tip-disp-uso.component';
import {TiendaEnLineaUsuarioComponent} from './Cliente/tienda-en-linea-usuario/tienda-en-linea-usuario.component';


/**
 * Se utiliza para moverse en las diferentes rutas del proyecto
 */
export let rutas: Routes;
rutas = [ {path: '', component: LoginComponent},
  { path: 'administrador', component: VistaAdminComponent,
  children: [
    {path: '', component: NavComponent},
    {path: 'informacionDispositivos', component: AgreInfoDispositivoComponent},
    {path: 'gestionDeTiposDeDispositivos', component: GestionDeTiposDisComponent},
    {path: 'gestionDeDistribuidores', component: GestionDistribuidoresComponent},
    {path: 'gestionDeTiendaEnLineaYDistribuidores', component: TiendaEnLineaComponent},
    {path: 'Dashboard', component: DashboardComponent},
  ]
  },
  {path: 'usuario', component : VistaClienteComponent,
    children: [
      {path: '' , component: NavUComponent},
      {path: 'gestionPerfil' , component: GestionPerfilComponent},
      {path: 'tiendaEnLinea' , component: TiendaEnLineaUsuarioComponent},
      {path: 'reportesDiaDisp' , component: RepDiaDispComponent},
      {path: 'reportesMensDisp', component: RepMenDisComponent},
      {path: 'reportesTipoDisUso' , component:  RepTipDispUsoComponent},
    ]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(rutas)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
