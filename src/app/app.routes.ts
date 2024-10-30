import { Routes } from '@angular/router';
import { IndexComponent } from './component/index/index.component';

export const routes: Routes = [
    {path: 'index', component: IndexComponent},
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: '**', redirectTo: 'index', pathMatch: 'full' },
];
