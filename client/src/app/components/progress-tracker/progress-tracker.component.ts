// components/progress-tracker/progress-tracker.component.ts
import { Component, OnInit } from '@angular/core';
import { WeeklyRoutineService } from '../../services/weekly-routine.service';
import { WeeklyRoutine, DailyRoutine } from '../../models/weekly-routine.model';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
  weeklyRoutines: WeeklyRoutine[] = [];
  selectedRoutine: WeeklyRoutine | null = null;
  currentWeekProgress: number = 0;

  constructor(private weeklyRoutineService: WeeklyRoutineService) {}

  ngOnInit(): void {
    this.loadWeeklyRoutines();
  }

  loadWeeklyRoutines(): void {
    const userId = 'user-id-actual'; // Obtener del servicio de autenticación
    this.weeklyRoutineService.getUserWeeklyRoutines(userId).subscribe(routines => {
      this.weeklyRoutines = routines;
    });
  }

  selectRoutine(routine: WeeklyRoutine): void {
    this.selectedRoutine = routine;
    this.calculateProgress();
  }

  toggleExerciseCompletion(dayIndex: number, exerciseIndex: number): void {
    if (!this.selectedRoutine) return;
    
    const exercise = this.selectedRoutine.rutinas[dayIndex].exercises[exerciseIndex];
    exercise.completado = !exercise.completado;
    
    // Verificar si todos los ejercicios del día están completos
    const allCompleted = this.selectedRoutine.rutinas[dayIndex].exercises.every(ex => ex.completado);
    this.selectedRoutine.rutinas[dayIndex].completada = allCompleted;
    
    if (allCompleted) {
      this.selectedRoutine.rutinas[dayIndex].diaCompletada = new Date();
    } else {
      this.selectedRoutine.rutinas[dayIndex].diaCompletada = undefined;
    }
    
    this.calculateProgress();
    this.saveChanges();
  }

  calculateProgress(): void {
    if (!this.selectedRoutine) return;
    
    const completedDays = this.selectedRoutine.rutinas.filter(day => day.completada).length;
    this.currentWeekProgress = (completedDays / this.selectedRoutine.rutinas.length) * 100;
  }

  saveChanges(): void {
    if (!this.selectedRoutine) return;
    
    this.weeklyRoutineService.updateWeeklyRoutine(this.selectedRoutine)
      .subscribe(updated => {
        this.selectedRoutine = updated;
      });
  }

  getDayName(dayIndex: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayIndex];
  }
   getExerciseName(exerciseId: string): string {
    const exercise = this.selectedRoutine?.rutinas.flatMap(day => day.exercises).find(ex => ex.exerciseId === exerciseId);
    return exercise ? exercise.exerciseId : 'Ejercicio Desconocido';    
  }
}
