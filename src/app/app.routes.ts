import { Routes } from '@angular/router';
import { IndexComponent } from './component/index/index.component';
import { EmailConfirmationComponent } from './component/index/email-confirmation/email-confirmation.component';
import { LoginComponent } from './component/index/login/login.component';
import { RegisterComponent } from './component/index/register/register.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: 'index', component: IndexComponent},
    { path: 'login', 
        component: LoginComponent, 
        data: {badCredential: false},
    },
    { path: 'confirm-email', component: EmailConfirmationComponent},
    { path: 'register', component: RegisterComponent},
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: '**', redirectTo: 'index', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }

];
