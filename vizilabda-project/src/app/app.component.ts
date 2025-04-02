import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './shared/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vizilabda-project';
  isLoggedIn = false;
  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }
  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
  }
  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    this.isLoggedIn = false;
    window.location.href = '/home';
  }
}
