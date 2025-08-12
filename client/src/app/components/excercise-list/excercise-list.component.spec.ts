import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseListComponent } from './excercise-list.component';
import { provideRouter, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let httpClient: HttpClient;
  let renderer: jasmine.SpyObj<Renderer2>;

  const mockExercises = [
    {
      _id: '1',
      name: 'Sentadilla',
      muscleGroups: ['Piernas'],
      equipmentRequired: 'pesas',
      difficulty: 'medio',
      videoUrl: 'http://example.com',
      visibility: 'system',
      isActive: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    },
    {
      _id: '2',
      name: 'Flexión',
      muscleGroups: ['Pecho', 'Brazos'],
      equipmentRequired: 'ninguno',
      difficulty: 'fácil',
      videoUrl: 'http://example.com',
      visibility: 'private',
      isActive: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }
  ];

  beforeEach(async () => {
    // Mock del Renderer2
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ExerciseListComponent // Componente standalone
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: Renderer2, useValue: rendererSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseListComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    renderer = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;

    // Mock del sidebarRef
    component.sidebarRef = {
      nativeElement: document.createElement('div')
    };
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar correctamente', () => {
    expect(component.exercises).toEqual([]);
    expect(component.filteredExercises).toEqual([]);
    expect(component.loading).toBeTrue();
    expect(component.error).toEqual('');
    expect(component.showAddForm).toBeFalse();
    expect(component.isCollapsed).toBeFalse();
  });

  describe('loadExercises', () => {
    it('debería cargar ejercicios correctamente', () => {
      spyOn(httpClient, 'get').and.returnValue(of({
        status: 'success',
        msg: 'Exercises loaded',
        data: mockExercises
      }));

      component.loadExercises();

      expect(httpClient.get).toHaveBeenCalledWith(`${environment.baseURL}/exercises/user-system`);
      expect(component.exercises).toEqual(mockExercises);
      expect(component.filteredExercises).toEqual(mockExercises);
      expect(component.loading).toBeFalse();
    });

    // it('debería manejar errores al cargar ejercicios', () => {
    //   spyOn(httpClient, 'get').and.throwError('Error de red');
    //   spyOn(console, 'error');

    //   component.loadExercises();

    //   expect(component.error).toEqual('Error al cargar los ejercicios');
    //   expect(component.loading).toBeFalse();
    //   expect(console.error).toHaveBeenCalled();
    // });
  });

  describe('filterExercises', () => {
    beforeEach(() => {
      component.exercises = mockExercises;
    });

    it('debería filtrar por término de búsqueda', () => {
      component.searchTerm = 'sentad';
      component.filterExercises();
      expect(component.filteredExercises.length).toBe(1);
      expect(component.filteredExercises[0].name).toBe('Sentadilla');
    });

    it('debería filtrar por visibilidad', () => {
      component.selectedVisibility = 'private';
      component.filterExercises();
      expect(component.filteredExercises.length).toBe(1);
      expect(component.filteredExercises[0].name).toBe('Flexión');
    });

    it('debería filtrar por dificultad', () => {
      component.selectedDifficulty = 'fácil';
      component.filterExercises();
      expect(component.filteredExercises.length).toBe(1);
      expect(component.filteredExercises[0].name).toBe('Flexión');
    });

    it('debería filtrar por equipo', () => {
      component.selectedEquipment = 'ninguno';
      component.filterExercises();
      expect(component.filteredExercises.length).toBe(1);
      expect(component.filteredExercises[0].name).toBe('Flexión');
    });
  });

//   describe('toggleSidebar', () => {
//     it('debería alternar el estado de la barra lateral', () => {
//       const initialValue = component.isExpanded;
      
//       component.toggleSidebar();
//       expect(component.isExpanded).toBe(!initialValue);
//       expect(renderer.addClass).toHaveBeenCalled();
      
//       component.toggleSidebar();
//       expect(component.isExpanded).toBe(initialValue);
//       expect(renderer.removeClass).toHaveBeenCalled();
//     });
//   });

  describe('logout', () => {
    it('debería navegar a login', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('addMuscleGroup', () => {
    it('debería agregar un grupo muscular', () => {
      component.muscleGroupInput = 'Piernas';
      component.addMuscleGroup();
      expect(component.newExercise.muscleGroups).toContain('Piernas');
      expect(component.muscleGroupInput).toEqual('');
    });

    it('no debería agregar grupos musculares vacíos', () => {
      component.muscleGroupInput = '   ';
      component.addMuscleGroup();
      expect(component.newExercise.muscleGroups.length).toBe(0);
    });
  });

  describe('removeMuscleGroup', () => {
    it('debería eliminar un grupo muscular', () => {
      component.newExercise.muscleGroups = ['Piernas', 'Espalda'];
      component.removeMuscleGroup(0);
      expect(component.newExercise.muscleGroups).toEqual(['Espalda']);
    });
  });

  describe('submitExercise', () => {
    it('debería enviar un nuevo ejercicio', () => {
      spyOn(httpClient, 'post').and.returnValue(of({
        status: 'success',
        msg: 'Exercise added',
        data: mockExercises[0]
      }));

      component.newExercise = {
        name: 'Sentadilla',
        muscleGroups: ['Piernas'],
        equipmentRequired: 'pesas',
        difficulty: 'medio',
        videoUrl: 'http://example.com'
      };

      component.submitExercise();

      expect(httpClient.post).toHaveBeenCalled();
      expect(component.exercises.length).toBe(1);
      expect(component.showAddForm).toBeFalse();
    });

    it('debería mostrar error si faltan campos', () => {
      component.newExercise = {
        name: '',
        muscleGroups: [],
        equipmentRequired: '',
        difficulty: 'medio',
        videoUrl: ''
      };

      component.submitExercise();

      expect(component.error).toBe('Por favor complete todos los campos requeridos');
    });
  });

  describe('deleteExercise', () => {
    it('debería eliminar un ejercicio', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(httpClient, 'delete').and.returnValue(of({}));

      component.exercises = [...mockExercises];
      component.deleteExercise('1');

      expect(httpClient.delete).toHaveBeenCalledWith(`${environment.baseURL}/exercises/1`);
      expect(component.exercises.length).toBe(1);
    });
  });
});
