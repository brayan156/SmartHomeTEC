import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public typeLogin = 0;
  constructor() { }

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

}
