import { Routes } from '@angular/router';
import { IndexComponent } from './component/index/index.component';
import { EmailConfirmationComponent } from './component/index/email-confirmation/email-confirmation.component';
import { LoginComponent } from './component/index/login/login.component';
import { RegisterComponent } from './component/index/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { AccountComponent } from './component/account/account.component';
import { ArchetypeComponent } from './component/archetype/archetype.component';
import { ArchetypeDetailsComponent } from './component/archetype-details/archetype-details.component';
import { CardDetailComponent } from './component/card-detail/card-detail.component';

export const routes: Routes = [
    {path: 'index', component: IndexComponent},
    { path: 'login', 
        component: LoginComponent, 
        data: {badCredential: false},
    },
    { path: 'confirm-email', component: EmailConfirmationComponent},
    { path: 'register', component: RegisterComponent},


    { path: 'home', component: HomeComponent },
    { path: 'account-manager', component:AccountComponent },
    { path: 'archetypes', component:ArchetypeComponent },
    { path: 'archetypeDetails/:archId', component: ArchetypeDetailsComponent},
    { path: 'card-detail/:cardName', component: CardDetailComponent},

];
