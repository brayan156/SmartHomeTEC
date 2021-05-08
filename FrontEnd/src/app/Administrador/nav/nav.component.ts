import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public navVerticalActive = false ;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
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
