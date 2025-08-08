import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { DailyRoutineComponent } from './components/daily-routine/daily-routine.component';
import { WeeklyRoutineComponent } from './components/weekly-routine/weekly-routine.component';

import { HomeComponent } from './components/pagina_principal/home/home.component';
import { NavbarComponent } from './components/pagina_principal/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginaPrincipalComponent } from './components/pagina_principal/pagina-principal/pagina-principal.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { isAuthGuard } from './guards/is-auth.guard';
import { ExerciseListComponent } from './components/excercise-list/excercise-list.component';


const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
  },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate:[isAuthGuard] },
  { path: 'register', component: RegisterComponent },

  { path: 'daily-routine',component: DailyRoutineComponent },
  { path: 'weekly-routine', component: WeeklyRoutineComponent },
  { path: 'ejecicios', component: ExerciseListComponent },
  { path: 'pagina-principal', component: PaginaPrincipalComponent },
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

