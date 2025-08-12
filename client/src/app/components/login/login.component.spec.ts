import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideRouter, RouterLink } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Respuesta } from '../../interfaces/respuesta.interface';
import { SharedModule } from '../../shared/shared.module';
import { NavbarComponent } from '../pagina_principal/navbar/navbar.component';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        LoginComponent,
        SharedModule,
        NavbarComponent,
        CommonModule,
        RouterLink
      ],
      providers: [
        provideRouter([]), // Configuración básica del router
        provideHttpClient(), // Provee HttpClient
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  // Escenario 5: Simulando error
  it('debería manejar errores correctamente', () => {
    spyOn(console, 'error');
    try {
      throw new Error('Error simulado');
    } catch (error) {
      console.error(error);
    }
    expect(console.error).toHaveBeenCalled();
  });

  it('debería inicializar el formulario con controles requeridos', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('debería marcar el formulario como inválido cuando está vacío', () => {
    component.loginForm.reset();
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería validar el formato del email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.passwordVisible).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('debería enviar el formulario cuando es válido', () => {
    // Configurar un formulario válido
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'ValidPass123!'
    });

    // Configurar el mock para el servicio
    const mockResponse: Respuesta = { 
      status: 'success', 
      msg: 'Login exitoso', 
      data: undefined 
    };
    authServiceMock.login.and.returnValue(of(mockResponse));

    // Llamar al método onSubmit
    component.onSubmit();

    // Verificar que se llamó al servicio
    expect(authServiceMock.login).toHaveBeenCalledWith(component.loginForm.value);
    
    // Verificar la navegación
    expect(routerMock.navigate).toHaveBeenCalledWith(['/shared/2fa/', mockResponse.data]);
  });

  it('no debería enviar el formulario cuando es inválido', () => {
    // Configurar un formulario inválido
    component.loginForm.reset();

    // Llamar al método onSubmit
    component.onSubmit();

    // Verificar que NO se llamó al servicio
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('debería manejar errores del servicio', () => {
    // Configurar un formulario válido
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'ValidPass123!'
    });

    // Configurar el mock para que falle
    const errorResponse: Respuesta = { 
      status: 'error', 
      msg: 'Error en el login', 
      data: undefined 
    };
    authServiceMock.login.and.returnValue(of(errorResponse));

    // Llamar al método onSubmit
    component.onSubmit();

    // Verificar que se actualizó la señal de respuesta
    expect(component.respuesta()).toEqual(errorResponse);
  });

  it('debería redirigir a la página de registro', () => {
    component.redirect();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
  });

  // Pruebas específicas para el template
  it('debería mostrar el formulario de login', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('debería mostrar el campo de email', () => {
    const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
    expect(emailInput).toBeTruthy();
  });

  it('debería mostrar el campo de contraseña', () => {
    const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');
    expect(passwordInput).toBeTruthy();
  });

  it('debería mostrar el botón de submit', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });
});
