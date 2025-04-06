import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterOutlet, RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
  isLoggedIn = false;
  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }
}
