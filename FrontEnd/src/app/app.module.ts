import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './AppComponent/app.component';
import {RouterModule} from '@angular/router';
import {rutas} from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './Administrador/nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent
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
