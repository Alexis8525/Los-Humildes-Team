// register.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../pagina_principal/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: [this.passwordMatchValidator, this.passwordStrengthValidator] 
    });
  }

  // Validador de coincidencia de contraseñas
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Validador de fortaleza de contraseña
  passwordStrengthValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    if (!password) return null;
  
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasMinLength = password.length >= 8;
  
    const valid = hasNumber && hasUpper && hasLower && hasSpecial && hasMinLength;
  
    return valid ? null : { strength: true };
  }

  // Getter para los criterios de contraseña
  get passwordCriteria() {
    const password = this.registerForm.get('password')?.value || '';
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password)
    };
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // Enviar formulario
  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
      // Aquí iría la lógica para enviar los datos al backend
      this.router.navigate(['/login']);
    }
  }
}
