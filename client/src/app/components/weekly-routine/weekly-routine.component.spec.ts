import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyRoutineComponent } from './weekly-routine.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { WeeklyRoutineService } from '../../services/weekly-routine.service';
import { of } from 'rxjs';
import { Exercise } from '../../models/exercise.model';

describe('WeeklyRoutineComponent', () => {
  let component: WeeklyRoutineComponent;
  let fixture: ComponentFixture<WeeklyRoutineComponent>;
  let mockExerciseService: jasmine.SpyObj<ExerciseService>;
  let mockWeeklyRoutineService: jasmine.SpyObj<WeeklyRoutineService>;

  beforeEach(async () => {
    // Crear mocks para los servicios
    mockExerciseService = jasmine.createSpyObj('ExerciseService', ['getExercises']);
    mockWeeklyRoutineService = jasmine.createSpyObj('WeeklyRoutineService', ['createWeeklyRoutine']);

    // Configurar valores de retorno para los mocks
    mockExerciseService.getExercises.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [WeeklyRoutineComponent], // Importar el componente standalone
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ExerciseService, useValue: mockExerciseService },
        { provide: WeeklyRoutineService, useValue: mockWeeklyRoutineService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'mock-value'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar ejercicios al iniciar', () => {
    expect(mockExerciseService.getExercises).toHaveBeenCalled();
  });

  it('debería seleccionar un día correctamente', () => {
    component.selectDay(1);
    expect(component.selectedDay).toBe(1);
    expect(component.dayExercises).toEqual([]);
  });

  it('debería agregar un ejercicio al día seleccionado', () => {
    component.selectedDay = 1;
    const mockExercise = { _id: '1', name: 'Ejercicio 1' } as Exercise;
    
    component.addExercise(mockExercise);
    
    expect(component.dayExercises.length).toBe(1);
    expect(component.dayExercises[0].exerciseId).toBe('1');
  });

  it('no debería agregar ejercicio si no hay día seleccionado', () => {
    component.selectedDay = null;
    const mockExercise = { _id: '1', name: 'Ejercicio 1' } as Exercise;
    
    component.addExercise(mockExercise);
    
    expect(component.dayExercises.length).toBe(0);
  });

  it('debería guardar la rutina del día', () => {
    component.selectedDay = 1;
    component.dayExercises = [{
      exerciseId: '1',
      series: 3,
      repeticiones: 10,
      descanso: '60s',
      completado: false,
      notas: ''
    }];
    
    component.saveDay();
    
    expect(component.weeklyRoutine.rutinas.length).toBe(1);
    expect(component.weeklyRoutine.rutinas[0].day).toBe(1);
    expect(component.selectedDay).toBeNull();
    expect(component.dayExercises).toEqual([]);
  });


});
