import { Routes } from '@angular/router';
import { IndexComponent } from './component/index/index.component';
import { EmailConfirmationComponent } from './component/index/email-confirmation/email-confirmation.component';

export const routes: Routes = [
    {path: 'index', component: IndexComponent},
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: '**', redirectTo: 'index', pathMatch: 'full' },
    { path: 'confirm-email', component: EmailConfirmationComponent},
];
