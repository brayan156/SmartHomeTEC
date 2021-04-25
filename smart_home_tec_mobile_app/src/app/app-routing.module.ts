import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'gestion-aposentos',
    loadChildren: () => import('./gestion-aposentos/gestion-aposentos.module').then( m => m.GestionAposentosPageModule)
  },
  {
    path: 'gestion-dispositivos',
    loadChildren: () => import('./gestion-dispositivos/gestion-dispositivos.module').then( m => m.GestionDispositivosPageModule)
  },
  {
    path: 'control-dispositivos-activos',
    loadChildren: () => import('./control-dispositivos-activos/control-dispositivos-activos.module').then( m => m.ControlDispositivosActivosPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
