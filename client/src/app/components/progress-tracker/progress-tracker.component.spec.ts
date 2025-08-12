import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressTrackerComponent } from './progress-tracker.component';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeeklyRoutineService } from '../../services/weekly-routine.service';
import { of } from 'rxjs';
import { WeeklyRoutine } from '../../models/weekly-routine.model';

describe('ProgressTrackerComponent', () => {
  let component: ProgressTrackerComponent;
  let fixture: ComponentFixture<ProgressTrackerComponent>;
  let weeklyRoutineService: jasmine.SpyObj<WeeklyRoutineService>;

  beforeEach(async () => {
    // Crear un mock del servicio
    const weeklyRoutineServiceSpy = jasmine.createSpyObj('WeeklyRoutineService', [
      'getUserWeeklyRoutines',
      'updateWeeklyRoutine'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ProgressTrackerComponent // Importamos el componente standalone
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: WeeklyRoutineService, useValue: weeklyRoutineServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressTrackerComponent);
    component = fixture.componentInstance;
    weeklyRoutineService = TestBed.inject(WeeklyRoutineService) as jasmine.SpyObj<WeeklyRoutineService>;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar correctamente', () => {
    expect(component.weeklyRoutines).toEqual([]);
    expect(component.selectedRoutine).toBeNull();
    expect(component.currentWeekProgress).toEqual(0);
  });

  describe('loadWeeklyRoutines', () => {
    it('debería cargar las rutinas semanales', () => {
      const mockRoutines: WeeklyRoutine[] = [
        {
          _id: '1',
          name: 'Rutina 1',
          rutinas: [],
          createdBy: 'user1',
          isActive: true
        }
      ];

      weeklyRoutineService.getUserWeeklyRoutines.and.returnValue(of(mockRoutines));
      
      component.loadWeeklyRoutines();
      
      expect(weeklyRoutineService.getUserWeeklyRoutines).toHaveBeenCalledWith('user-id-actual');
      expect(component.weeklyRoutines).toEqual(mockRoutines);
    });
  });

  describe('selectRoutine', () => {
    it('debería seleccionar una rutina y calcular el progreso', () => {
      const mockRoutine: WeeklyRoutine = {
        _id: '1',
        name: 'Rutina 1',
        rutinas: [
          { day: 0, exercises: [], completada: false },
          { day: 1, exercises: [], completada: true }
        ],
        createdBy: 'user1',
        isActive: true
      };

      component.selectRoutine(mockRoutine);
      
      expect(component.selectedRoutine).toEqual(mockRoutine);
      expect(component.currentWeekProgress).toEqual(50);
    });
  });

  describe('toggleExerciseCompletion', () => {
    it('debería alternar el estado de completado de un ejercicio', () => {
      const mockRoutine: WeeklyRoutine = {
        _id: '1',
        name: 'Rutina 1',
        rutinas: [
          { 
            day: 0, 
            exercises: [
              {
                  exerciseId: 'ex1', completado: false,
                  notas: ''
              }
            ], 
            completada: false 
          }
        ],
        createdBy: 'user1',
        isActive: true
      };

      component.selectedRoutine = mockRoutine;
      weeklyRoutineService.updateWeeklyRoutine.and.returnValue(of(mockRoutine));
      
      component.toggleExerciseCompletion(0, 0);
      
      expect(mockRoutine.rutinas[0].exercises[0].completado).toBeTrue();
      expect(weeklyRoutineService.updateWeeklyRoutine).toHaveBeenCalledWith(mockRoutine);
    });
  });

  describe('calculateProgress', () => {
    it('debería calcular el progreso correctamente', () => {
      const mockRoutine: WeeklyRoutine = {
        _id: '1',
        name: 'Rutina 1',
        rutinas: [
          { day: 0, exercises: [], completada: true },
          { day: 1, exercises: [], completada: false },
          { day: 2, exercises: [], completada: true }
        ],
        createdBy: 'user1',
        isActive: true
      };

      component.selectedRoutine = mockRoutine;
      component.calculateProgress();
      
      expect(component.currentWeekProgress).toBeCloseTo(66.666);
    });
  });

  describe('getDayName', () => {
    it('debería devolver el nombre correcto del día', () => {
      expect(component.getDayName(0)).toEqual('Domingo');
      expect(component.getDayName(1)).toEqual('Lunes');
      expect(component.getDayName(6)).toEqual('Sábado');
    });
  });
});
