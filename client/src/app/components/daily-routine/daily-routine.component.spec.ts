import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyRoutineComponent } from './daily-routine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineService } from '../../services/routine.service';
import { of, throwError } from 'rxjs';
import { Exercise } from '../../models/exercise.model';
import { Routine, RoutineExercise } from '../../models/routine.model'; 

describe('DailyRoutineComponent', () => {
  let component: DailyRoutineComponent;
  let fixture: ComponentFixture<DailyRoutineComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;
  let routineService: jasmine.SpyObj<RoutineService>;
  let renderer: jasmine.SpyObj<Renderer2>;
  let router: Router;

  const mockExercises: Exercise[] = [
    { 
      _id: '1', 
      createdBy: 'user1',
      name: 'Sentadilla', 
      muscleGroups: [], 
      equipmentRequired: '', 
      difficulty: 'medio', 
      visibility: 'system', 
      isActive: true 
    },
    { 
      _id: '2', 
      createdBy: 'user1',
      name: 'Flexiones', 
      muscleGroups: [], 
      equipmentRequired: '', 
      difficulty: 'fácil', 
      visibility: 'system', 
      isActive: true 
    }
  ];

  beforeEach(async () => {
    // Crear mocks de los servicios
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', ['getExercises']);
    const routineServiceSpy = jasmine.createSpyObj('RoutineService', ['createRoutine']);
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterModule,
        DailyRoutineComponent
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ExerciseService, useValue: exerciseServiceSpy },
        { provide: RoutineService, useValue: routineServiceSpy },
        { provide: Renderer2, useValue: rendererSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyRoutineComponent);
    component = fixture.componentInstance;
    
    // Obtener las instancias de los servicios mockeados
    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    routineService = TestBed.inject(RoutineService) as jasmine.SpyObj<RoutineService>;
    renderer = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;
    router = TestBed.inject(Router);

    // Configurar el mock del sidebarRef
    component.sidebarRef = {
      nativeElement: document.createElement('div')
    };
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar correctamente', () => {
    expect(component.exercises).toEqual([]);
    expect(component.selectedExercises).toEqual([]);
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toEqual('');
    expect(component.isExpanded).toBeFalse();
    expect(component.isCollapsed).toBeFalse();
  });

  describe('loadExercises', () => {
    it('debería cargar ejercicios correctamente', () => {
      exerciseService.getExercises.and.returnValue(of(mockExercises));
      
      component.loadExercises();
      
      expect(exerciseService.getExercises).toHaveBeenCalled();
      expect(component.exercises).toEqual(mockExercises);
      expect(component.isLoading).toBeFalse();
    });

    it('debería manejar error al cargar ejercicios', () => {
      exerciseService.getExercises.and.returnValue(throwError(() => new Error('Error')));
      spyOn(console, 'error');
      
      component.loadExercises();
      
      expect(exerciseService.getExercises).toHaveBeenCalled();
      expect(component.errorMessage).toEqual('Error al cargar ejercicios');
      expect(console.error).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('addExercise', () => {
    it('debería agregar un ejercicio a la rutina', () => {
      const exercise = mockExercises[0];
      component.addExercise(exercise);
      
      expect(component.selectedExercises.length).toBe(1);
      expect(component.selectedExercises[0].exerciseId).toBe(exercise._id);
      expect(component.selectedExercises[0].series).toBe(3);
    });
  });

  describe('removeExercise', () => {
    it('debería eliminar un ejercicio de la rutina', () => {
      component.selectedExercises = [
        { exerciseId: '1', series: 3, repeticiones: 10, descanso: '60s' },
        { exerciseId: '2', series: 3, repeticiones: 10, descanso: '60s' }
      ];
      
      component.removeExercise(0);
      
      expect(component.selectedExercises.length).toBe(1);
      expect(component.selectedExercises[0].exerciseId).toBe('2');
    });
  });

  describe('createRoutine', () => {
    it('debería crear una rutina correctamente', () => {
      const mockRoutine: Routine = {
        _id: 'new-id',
        name: 'Rutina de prueba',
        exercises: [{ exerciseId: '1', series: 3, repeticiones: 10, descanso: '60s' }],
        createdBy: 'user-id-actual',
        isActive: true
      };
      
      routineService.createRoutine.and.returnValue(of(mockRoutine));
      component.routine.name = 'Rutina de prueba';
      component.selectedExercises = [
        { exerciseId: '1', series: 3, repeticiones: 10, descanso: '60s' }
      ];
      
      component.createRoutine();
      
      expect(routineService.createRoutine).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });

    it('debería mostrar error si no hay nombre', () => {
      component.routine.name = '';
      component.selectedExercises = [
        { exerciseId: '1', series: 3, repeticiones: 10, descanso: '60s' }
      ];
      
      component.createRoutine();
      
      expect(component.errorMessage).toEqual('Nombre y al menos un ejercicio son requeridos');
      expect(routineService.createRoutine).not.toHaveBeenCalled();
    });

    it('debería mostrar error si no hay ejercicios', () => {
      component.routine.name = 'Rutina de prueba';
      component.selectedExercises = [];
      
      component.createRoutine();
      
      expect(component.errorMessage).toEqual('Nombre y al menos un ejercicio son requeridos');
      expect(routineService.createRoutine).not.toHaveBeenCalled();
    });

    it('debería manejar error al crear rutina', () => {
      routineService.createRoutine.and.returnValue(throwError(() => new Error('Error')));
      component.routine.name = 'Rutina de prueba';
      component.selectedExercises = [
        { exerciseId: '1', series: 3, repeticiones: 10, descanso: '60s' }
      ];
      spyOn(console, 'error');
      
      component.createRoutine();
      
      expect(routineService.createRoutine).toHaveBeenCalled();
      expect(component.errorMessage).toEqual('Error al crear la rutina');
      expect(console.error).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('getExerciseName', () => {
    it('debería devolver el nombre del ejercicio', () => {
      component.exercises = mockExercises;
      const name = component.getExerciseName('1');
      expect(name).toBe('Sentadilla');
    });

    it('debería devolver mensaje si no encuentra el ejercicio', () => {
      component.exercises = mockExercises;
      const name = component.getExerciseName('99');
      expect(name).toBe('Ejercicio no encontrado');
    });
  });
  describe('logout', () => {
    it('debería navegar a la página de login', () => {
      spyOn(router, 'navigate');
      
      component.logout();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
