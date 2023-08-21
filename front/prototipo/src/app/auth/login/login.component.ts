import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  public goTo(cargo: string) {
    switch (cargo) {
      case '':
        //return this.router.navigate(['']);
      case '':
        //return this.router.navigate(['']);
      case '':
        //return this.router.navigate(['']);
      default:
        //return this.router.navigate(['/login']);
    }
  }

}

