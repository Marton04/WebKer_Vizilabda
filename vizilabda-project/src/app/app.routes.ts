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
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
];

