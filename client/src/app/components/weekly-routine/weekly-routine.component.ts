import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../services/exercise.service';
import { WeeklyRoutineService } from '../../services/weekly-routine.service';
import { Exercise } from '../../models/exercise.model';
import { WeeklyRoutine, DailyRoutine, WeeklyRoutineExercise } from './../../models/weekly-routine.model'; 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../pagina_principal/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-weekly-routine',
  standalone: true,
      imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NavbarComponent,
      MatIconModule,
      MatProgressSpinnerModule
      ],
  templateUrl: './weekly-routine.component.html',
  styleUrls: ['./weekly-routine.component.scss']
})
export class WeeklyRoutineComponent implements OnInit {
  exercises: Exercise[] = [];
  days = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
    { id: 0, name: 'Domingo' }
  ];
  weeklyRoutine: WeeklyRoutine = {
    _id: '',
    name: '',
    createdBy: '',
    rutinas: [],
    isActive: true
  };
  selectedDay: number | null = null;
  dayExercises: WeeklyRoutineExercise[] = [];

  constructor(
    private exerciseService: ExerciseService,
    private weeklyRoutineService: WeeklyRoutineService
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.exerciseService.getExercises().subscribe(exercises => {
      this.exercises = exercises;
    });
  }

  selectDay(day: number): void {
    this.selectedDay = day;
    this.dayExercises = [];
  }

  addExercise(exercise: Exercise): void {
    if (this.selectedDay === null) return;
    
    this.dayExercises.push({
      exerciseId: exercise._id,
      series: 3,
      repeticiones: 10,
      descanso: '60s',
      completado: false,
      notas: ''
    });
  }

  saveDay(): void {
    if (this.selectedDay === null) return;
    
    const dayRoutine: DailyRoutine = {
      day: this.selectedDay,
      exercises: this.dayExercises,
      completada: false
    };
    
    // Buscar si ya existe rutina para este día
    const existingDayIndex = this.weeklyRoutine.rutinas.findIndex(r => r.day === this.selectedDay);
    
    if (existingDayIndex >= 0) {
      this.weeklyRoutine.rutinas[existingDayIndex] = dayRoutine;
    } else {
      this.weeklyRoutine.rutinas.push(dayRoutine);
    }
    
    this.selectedDay = null;
    this.dayExercises = [];
  }

  createWeeklyRoutine(): void {
    const userId = 'user-id-actual'; // Obtener del servicio de autenticación
    this.weeklyRoutine.createdBy = userId;
    
    this.weeklyRoutineService.createWeeklyRoutine(this.weeklyRoutine).subscribe(response => {
      console.log('Rutina semanal creada:', response);
      // Redirigir o mostrar mensaje de éxito
    });
  }

  getDayName(dayId: number): string {
    const day = this.days.find(d => d.id === dayId);
    return day ? day.name : '';
  }

  getExerciseName(exerciseId: string): string {
    const exercise = this.exercises.find(e => e._id === exerciseId);
    return exercise ? exercise.name : 'Ejercicio no encontrado';
  }

  isLoading: boolean = false;
  isLoadingExercises: boolean = false;
  isSavingDay: boolean = false;
  isCreating: boolean = false;
  errorMessage: string = '';

// Métodos auxiliares para el template
isDaySaved(dayId: number): boolean {
  return this.weeklyRoutine.rutinas.some(r => r.day === dayId);
}

isExerciseAdded(exerciseId: string): boolean {
  return this.dayExercises.some(e => e.exerciseId === exerciseId);
}
}
