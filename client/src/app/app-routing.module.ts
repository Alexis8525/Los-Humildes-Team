import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { DailyRoutineComponent } from './components/daily-routine/daily-routine.component';
import { WeeklyRoutineComponent } from './components/weekly-routine/weekly-routine.component';

import { HomeComponent } from './components/pagina_principal/home/home.component';
import { NavbarComponent } from './components/pagina_principal/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { isAuthGuard } from './guards/is-auth.guard';


const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
  },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate:[isAuthGuard] },
  { path: 'register', component: RegisterComponent },

  {
    path: 'daily-routine',
    component: DailyRoutineComponent
  },
  /* {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }, */
  { path: 'weekly-routine', component: WeeklyRoutineComponent },
  { path: 'progress', component: ProgressTrackerComponent },
  /* { path: '', redirectTo: '/progress', pathMatch: 'full' } */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

