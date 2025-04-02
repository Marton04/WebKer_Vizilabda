import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'bajnoksag',
        loadComponent: () => import('./pages/bajnoksag/bajnoksag.component').then(m => m.BajnoksagComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    
    {
        path: '**',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
];

