import { Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { Componente1Component } from './modulo1/componente1/componente1.component';
import { Componente2Component } from './modulo2/componente2/componente2.component';
import { AcercaDeComponent } from './modulo2/acerca-de/acerca-de.component';
import { AuthKeycloakGuard } from '../../core/guards/auth-keycloak.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    canActivate: [AuthKeycloakGuard],
    children: [
      {
        path: 'modulo1',
        component: Componente1Component
      },
      {
        path: 'modulo2',
        children: [
          {
            path: 'componente-2',
            component: Componente2Component,
            canActivate: [AuthKeycloakGuard]
          },
          {
            path: 'acerca-de',
            component: AcercaDeComponent,
            canActivate: [AuthKeycloakGuard]
          },
          {
            path: '**', redirectTo: 'componente-2'
          }
        ]
      },
      
    ]
  }
];


