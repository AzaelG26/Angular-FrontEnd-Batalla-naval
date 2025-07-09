import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { layoutComponent } from './pages/layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { GameViewComponent } from './pages/game-view/game-view';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '', component: WelcomeComponent },
    { 
        path: 'dashboard',
        component: layoutComponent,
        children: [
            { path: '', component: DashboardComponent},
            { path: 'games/:id', component: GameViewComponent } 

        ]

    }
];
