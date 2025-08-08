// models/routine.model.ts
export interface RoutineExercise {
  exerciseId: string;
  series?: number;
  repeticiones?: number;
  duracion?: number;
  descanso?: string;
}

export interface Routine {
  _id: string;
  name: string;
  descrip?: string;
  exercises: RoutineExercise[];
  createdBy: string;
  isActive: boolean;
}
