import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { AppRoutingModule } from './app-routing.module';

// Registra el idioma español
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
    // App Routing
    AppRoutingModule,
    
    // Angular Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
