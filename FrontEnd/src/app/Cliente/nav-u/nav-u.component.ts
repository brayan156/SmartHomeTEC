import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-u',
  templateUrl: './nav-u.component.html',
  styleUrls: ['./nav-u.component.css']
})
export class NavUComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navegation(router): void{
    this.router.navigateByUrl('/usuario/'.concat(router));
  }
}
