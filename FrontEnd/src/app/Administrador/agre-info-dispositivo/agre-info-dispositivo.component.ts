import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-agre-info-dispositivo',
  templateUrl: './agre-info-dispositivo.component.html',
  styleUrls: ['./agre-info-dispositivo.component.css']
})
export class AgreInfoDispositivoComponent implements OnInit {
  public navVerticalActive = false ;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  activeNavVertical(): boolean {
    if (this.navVerticalActive === false){
      this.navVerticalActive = true;
      return this.navVerticalActive;
    }
    else {
      this.navVerticalActive = false;
      return this.navVerticalActive;
    }
  }
  navegation(router): void{
    this.router.navigateByUrl('/administrador/'.concat(router));
  }
}
