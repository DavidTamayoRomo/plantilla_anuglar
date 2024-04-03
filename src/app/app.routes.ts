import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { HomePageComponent } from './modules/home-page.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent},
    {
        path: 'modulo1',
        loadChildren: () => import('./modules/modulo1/modulo1.routes').then(m => m.MODULO1_ROUTES)
    },
    {
        path: 'modulo2',
        loadChildren: () => import('./modules/modulo2/modulo2.routes').then(m => m.MODULO2_ROUTES)
    },
    {path: 'internal-error', component: InternalErrorComponent},
    // Here add new pages component
    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];