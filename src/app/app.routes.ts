import { Routes } from '@angular/router';
import { IndexComponent } from './component/index/index.component';
import { EmailConfirmationComponent } from './component/index/email-confirmation/email-confirmation.component';
import { LoginComponent } from './component/index/login/login.component';

export const routes: Routes = [
    {path: 'index', component: IndexComponent},
    { path: 'login', 
        component: LoginComponent, 
        data: {badCredential: false},
        providers: [
            {provide: 'AuthStrategy', useValue: 'AuthStrategy'}
        ]
    },
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: '**', redirectTo: 'index', pathMatch: 'full' },
    { path: 'confirm-email', component: EmailConfirmationComponent},
];
