import { Routes } from '@angular/router';
import { Componente2Component } from './componente2/componente2.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';

export const MODULO2_ROUTES: Routes = [
  {
    path: 'componente-2',
    component: Componente2Component
  },
  {
    path: 'acerca-de',
    component: AcercaDeComponent
  },
  {
    path: '**', redirectTo: 'componente-2'
  }
];


