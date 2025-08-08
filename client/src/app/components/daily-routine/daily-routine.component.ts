import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineService } from '../../services/routine.service';
import { Exercise } from '../../models/exercise.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Routine, RoutineExercise } from '../../models/routine.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../pagina_principal/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-daily-routine',
   standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    MatIconModule,
    MatProgressSpinnerModule
    ],
  templateUrl: './daily-routine.component.html',
  styleUrls: ['./daily-routine.component.scss']
})
export class DailyRoutineComponent implements OnInit {
  exercises: Exercise[] = [];
  selectedExercises: RoutineExercise[] = [];
  routine: Routine = {
    _id: '',
    name: '',
    exercises: [],
    createdBy: '', // Se llenará con el ID del usuario actual
    isActive: true
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private exerciseService: ExerciseService,
    private routineService: RoutineService
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.exerciseService.getExercises().subscribe({
      next: (exercises) => {
        this.exercises = exercises;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading exercises:', err);
        this.errorMessage = 'Error al cargar ejercicios';
        this.isLoading = false;
      }
    });
  }

  addExercise(exercise: Exercise): void {
    this.selectedExercises.push({
      exerciseId: exercise._id,
      series: 3,
      repeticiones: 10,
      descanso: '60s'
    });
  }

  removeExercise(index: number): void {
    this.selectedExercises.splice(index, 1);
  }

  createRoutine(): void {
    if (!this.routine.name || this.selectedExercises.length === 0) {
      this.errorMessage = 'Nombre y al menos un ejercicio son requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const userId = 'user-id-actual'; // Reemplazar con autenticación real
    
    this.routine.createdBy = userId;
    this.routine.exercises = this.selectedExercises;
    
    this.routineService.createRoutine(this.routine).subscribe({
      next: (response) => {
        console.log('Rutina creada:', response);
        this.resetForm();
        // Aquí podrías redirigir o mostrar mensaje de éxito
      },
      error: (err) => {
        console.error('Error creating routine:', err);
        this.errorMessage = 'Error al crear la rutina';
        this.isLoading = false;
      }
    });
  }

  getExerciseName(exerciseId: string): string {
    const exercise = this.exercises.find(e => e._id === exerciseId);
    return exercise ? exercise.name : 'Ejercicio no encontrado';
  }

  private resetForm(): void {
    this.routine = {
      _id: '',
      name: '',
      exercises: [],
      createdBy: '',
      isActive: true
    };
    this.selectedExercises = [];
    this.isLoading = false;
  }
}
