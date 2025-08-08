import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { DailyRoutineComponent } from './components/daily-routine/daily-routine.component';
import { WeeklyRoutineComponent } from './components/weekly-routine/weekly-routine.component';

import { HomeComponent } from './components/pagina_principal/home/home.component';
import { NavbarComponent } from './components/pagina_principal/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

    { 
    path: 'daily-routine', 
    component: DailyRoutineComponent 
  },
  { 
    path: '', 
    redirectTo: '/daily-routine', 
    pathMatch: 'full' 
  },
  { path: 'weekly-routine', component: WeeklyRoutineComponent },
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

