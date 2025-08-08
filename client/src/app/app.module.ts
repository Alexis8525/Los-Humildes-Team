import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Localización
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DatePipe } from '@angular/common';

// Componentes
import { AppComponent } from './app.component';

import { ExerciseListComponent } from './components/excercise-list/excercise-list.component'; // Asegúrate de que el nombre del componente sea correcto
import { DailyRoutineComponent } from './components/daily-routine/daily-routine.component';
import { AppRoutingModule } from './app-routing.module';
import { WeeklyRoutineComponent } from './components/weekly-routine/weekly-routine.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';

// Registra el idioma español
registerLocaleData(localeEs);



@NgModule({
  declarations: [
    AppComponent,
    ExerciseListComponent, // Corregí el nombre de "Excercise" a "Exercise"
    DailyRoutineComponent, 
    WeeklyRoutineComponent, ProgressTrackerComponent
  ],
  imports: [
    // Angular Modules
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // App Routing
    AppRoutingModule,

    
    // Angular Material Modules (agrupados)
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
  
    ReactiveFormsModule, 
    RouterModule,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' }, // Configuración de localización (es)
    DatePipe // Proveedor para usar DatePipe en los componentes
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
