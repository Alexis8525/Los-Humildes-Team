export interface WeeklyRoutineExercise {
  exerciseId: string;
  series?: number;
  repeticiones?: number;
  duracion?: number;
  descanso?: string;
  completado: boolean;
  notas: string;
}

export interface DailyRoutine {
  rutinaId?: string;
  day: number; // 0-domingo, 1-lunes, ..., 6-sábado
  exercises: WeeklyRoutineExercise[];
  completada: boolean;
  diaCompletada?: Date;
}

export interface WeeklyRoutine {
  _id: string;
  name: string;
  createdBy: string;
  rutinas: DailyRoutine[];
  isActive: boolean;
}
