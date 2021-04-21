import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public navVerticalActive = false ;
  constructor() { }

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
}
