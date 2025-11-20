
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; 
  weight: number;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface CompletedSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  sets: CompletedSet[];
}

export interface WorkoutLog {
  id:string;
  routineId: string;
  routineName: string; 
  date: string;
  durationSeconds: number;
  completedExercises: CompletedExercise[];
  postWorkoutNotes?: string;
}
