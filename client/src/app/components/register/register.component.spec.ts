import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { Respuesta } from '../../interfaces/respuesta.interface';
import { SharedModule } from '../../shared/shared.module';
import { NavbarComponent } from '../pagina_principal/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let router: Router;
  let formBuilder: FormBuilder;

  const mockResponse: Respuesta = { 
    status: 'success', 
    msg: 'Registro exitoso', 
    data: undefined
  };

  beforeEach(async () => {
    // Crear mocks para los servicios
    authServiceMock = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SharedModule,
        NavbarComponent,
        RegisterComponent
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con controles requeridos', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.contains('name')).toBeTrue();
    expect(component.registerForm.contains('lastN')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('confirmPassword')).toBeTrue();
  });

  it('debería marcar el formulario como inválido cuando está vacío', () => {
    component.registerForm.reset();
    expect(component.registerForm.valid).toBeFalse();
  });

  it('debería validar que el nombre tenga al menos 3 caracteres', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('ab');
    expect(nameControl?.valid).toBeFalse();
    nameControl?.setValue('abc');
    expect(nameControl?.valid).toBeTrue();
  });

  it('debería validar el formato del email', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('debería validar la fortaleza de la contraseña', () => {
    const passwordControl = component.registerForm.get('password');
    
    // Contraseña débil
    passwordControl?.setValue('weakpass');
    expect(component.registerForm.errors).toEqual({ strength: true });
    
    // Contraseña fuerte
    passwordControl?.setValue('StrongPass123!');
    expect(component.registerForm.errors).toBeNull();
  });

  it('debería validar que las contraseñas coincidan', () => {
    component.registerForm.get('password')?.setValue('Password123!');
    component.registerForm.get('confirmPassword')?.setValue('Different123!');
    expect(component.registerForm.errors).toEqual({ mismatch: true });
    
    component.registerForm.get('confirmPassword')?.setValue('Password123!');
    expect(component.registerForm.errors).toBeNull();
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.passwordVisible).toBeFalse();
    component.togglePasswordVisibility('password');
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility('password');
    expect(component.passwordVisible).toBeFalse();
  });

  it('debería alternar la visibilidad de la confirmación de contraseña', () => {
    expect(component.confirmPasswordVisible).toBeFalse();
    component.togglePasswordVisibility('confirmPassword');
    expect(component.confirmPasswordVisible).toBeTrue();
    component.togglePasswordVisibility('confirmPassword');
    expect(component.confirmPasswordVisible).toBeFalse();
  });

  describe('onSubmit', () => {
    it('debería enviar el formulario cuando es válido', () => {
      // Configurar un formulario válido
      component.registerForm.setValue({
        name: 'Test User',
        lastN: 'Test Last',
        email: 'test@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!'
      });

      authServiceMock.register.and.returnValue(of(mockResponse));
      spyOn(router, 'navigate');

      component.onSubmit();

      // Verificar que se llamó al servicio
      expect(authServiceMock.register).toHaveBeenCalledWith(component.registerForm.value);
      
      // Verificar la navegación
      expect(router.navigate).toHaveBeenCalledWith(['/shared/created']);
      
      // Verificar la señal de respuesta
      expect(component.respuesta()).toEqual(mockResponse);
    });

    it('no debería enviar el formulario cuando es inválido', () => {
      // Configurar un formulario inválido
      component.registerForm.reset();

      // Llamar al método onSubmit
      component.onSubmit();

      // Verificar que NO se llamó al servicio
      expect(authServiceMock.register).not.toHaveBeenCalled();
    });

    it('debería manejar errores del servicio', () => {
      // Configurar un formulario válido
      component.registerForm.setValue({
        name: 'Test User',
        lastN: 'Test Last',
        email: 'test@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!'
      });

      const errorResponse: Respuesta = { 
        status: 'error', 
        msg: 'Error en el registro', 
        data: undefined
      };

      authServiceMock.register.and.returnValue(throwError(() => ({ error: errorResponse })));

      // Llamar al método onSubmit
      component.onSubmit();

      // Verificar que se actualizó la señal de respuesta
      expect(component.respuesta()).toEqual(errorResponse);
    });
  });

  describe('passwordCriteria', () => {
    it('debería evaluar correctamente los criterios de la contraseña', () => {
      // Contraseña que cumple todos los criterios
      component.registerForm.get('password')?.setValue('StrongPass123!');
      expect(component.passwordCriteria).toEqual({
        minLength: true,
        uppercase: true,
        lowercase: true,
        number: true,
        specialChar: true
      });

      // Contraseña que no cumple todos los criterios
      component.registerForm.get('password')?.setValue('weak');
      expect(component.passwordCriteria).toEqual({
        minLength: false,
        uppercase: false,
        lowercase: true,
        number: false,
        specialChar: false
      });
    });
  });
});
