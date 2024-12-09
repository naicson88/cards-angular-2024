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
import { DeckDetailUserComponent } from './component/deck-detail-user/deck-detail-user.component';
import { SearchBoxComponent } from './component/search-box/search-box.component';
import { ErrorPagesComponent } from './component/error-pages/error-pages.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { MaintenencePageComponent } from './component/maintenence-page/maintenence-page.component';
import { BaseRoleGuard } from './util/BaseRoleGuard';
import { CardsSearchComponent } from './component/card-search/card-search.component';
import { DeckComponent } from './component/deck/deck.component';
import { TransferComponent } from './component/transfer/transfer.component';

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
    { path: 'decks', component: DeckComponent , data : {set_type: 'DECK', source: 'KONAMI'}},
    { path: 'usercollection/decks', component: DeckComponent , data : {set_type: 'DECK', source: 'USER'}},
   // { path: 'usercollection/cards', component: UsercardsComponent },
    { path: 'usercollection/transfer', component: TransferComponent},

    { path: 'confirm-email', component: EmailConfirmationComponent},
    { path: 'archetypes', component: ArchetypeComponent},
    { path: 'archetypeDetails/:archId', component: ArchetypeDetailsComponent},
    { path: 'cards-search', component: CardsSearchComponent},
    { path: 'userdeck-details/:deckName', component: DeckDetailUserComponent },
    { path: 'search-box', component: SearchBoxComponent},
    { path: 'error-page/:code', component:ErrorPagesComponent},
    { path: 'maintenence', component:MaintenencePageComponent},
    { path: 'admin-dashboard', component:DashboardComponent, canActivate: [BaseRoleGuard]},
    { path: 'dashboard/:setName', component:DashboardComponent },
    { path: 'account-manager', component:AccountComponent },

];
