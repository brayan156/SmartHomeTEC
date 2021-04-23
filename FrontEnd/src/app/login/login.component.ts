import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public typeLogin = 0;

  constructor(
    private router: Router) {

  }

  ngOnInit(): void {
  }

  chageAdmin(): void{
    this.typeLogin = 0;
  }

  chageUser(): void{
    this.typeLogin = 1;
  }
  loginType(): boolean{
    if (this.typeLogin === 0){
      return true;
    }
    else {
      return false;
    }
  }
  navegation(): void{
    if (this.typeLogin === 0){
      this.router.navigate(['/administrador']);
    }
    else {
      this.router.navigate(['/usuario']);
    }
  }
}
