import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthGuard } from './guards/is-auth.guard';
import { HomeComponent } from './components/pagina_principal/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DailyRoutineComponent } from './components/daily-routine/daily-routine.component';
import { WeeklyRoutineComponent } from './components/weekly-routine/weekly-routine.component';
import { ExerciseListComponent } from './components/excercise-list/excercise-list.component';
import { PaginaPrincipalComponent } from './components/pagina_principal/pagina-principal/pagina-principal.component';

const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
  },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [isAuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'daily-routine', component: DailyRoutineComponent },
  { path: 'weekly-routine', component: WeeklyRoutineComponent },
  { path: 'ejercicios', component: ExerciseListComponent },
  { path: 'pagina-principal', component: PaginaPrincipalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }