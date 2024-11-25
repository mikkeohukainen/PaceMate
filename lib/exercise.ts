export type ExerciseType = "running" | "walking" | "cycling";

export interface Exercise {
  id: number;
  type: ExerciseType | null;
  start_time: string | null;
  end_time: string | null;
  duration: number | null;
  distance: number | null;
  avg_speed: number | null;
  steps: number | null;
}

export interface CompletedExercise {
  id: number;
  type: string;
  start_time: string;
  end_time: string;
  duration: number;
  distance: number | null;
  avg_speed: number | null;
  steps: number | null;
}
