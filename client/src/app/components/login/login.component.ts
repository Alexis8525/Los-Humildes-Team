// login.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,

  FormsModule,
  ReactiveFormsModule,
  Validators

} from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../pagina_principal/navbar/navbar.component';
import { BarraLateralComponent } from '../pagina_principal/barra-lateral/barra-lateral.component';
import { AuthService } from '../../services/auth/auth.service';
import { Respuesta } from '../../interfaces/respuesta.interface';
import { catchError, of, tap } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    SharedModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordVisible = false;
  private authService = inject(AuthService);
  public respuesta = signal<Respuesta>({ status: 'error', msg: '', data: undefined });


  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['jk@email.com', [Validators.required, Validators.email]],
      password: ['Pass*123456', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario válido:', this.loginForm.value);
      // Aquí iría la lógica para autenticar al usuario
      // Ejemplo: this.authService.login(this.loginForm.value);
      this.router.navigate(['/pagina-principal']);
      //this.router.navigate(['/dashboard']);
      this.authService.login(this.loginForm.value).pipe(
        tap({
          next: (resp: Respuesta) => {
            this.respuesta.set(resp);
            console.log(resp);
            this.router.navigate(['/shared/2fa/',resp.data])
          },
        }),
        catchError((err) => {
          console.log(err);
          this.respuesta.set(err.error);
          return of(null)
        })
      ).subscribe();
    }
  }

  redirect() {
    this.router.navigate(['/register']);
  }
}
