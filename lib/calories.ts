import { Exercise } from "./exercise";

const metabolicEquivalentOfTask = (
  exerciseType: string,
  avgSpeed: number
): number => {
  if (avgSpeed <= 0) return 0;

  switch (exerciseType.toLowerCase()) {
    // https://pacompendium.com/walking/
    case "walking":
      if (avgSpeed <= 4.0) return 3.0;
      if (avgSpeed <= 5.5) return 3.8;
      if (avgSpeed <= 6.3) return 4.8;
      if (avgSpeed <= 7.0) return 5.5;
      if (avgSpeed <= 7.9) return 7.0;
      if (avgSpeed <= 8.9) return 8.5;
      break;

    // https://pacompendium.com/running/
    case "running":
      if (avgSpeed <= 6.7) return 6.5;
      if (avgSpeed <= 7.7) return 7.8;
      if (avgSpeed <= 8.4) return 8.5;
      if (avgSpeed <= 9.3) return 9.0;
      if (avgSpeed <= 10.1) return 9.3;
      if (avgSpeed <= 10.8) return 10.5;
      if (avgSpeed <= 11.3) return 11.0;
      if (avgSpeed <= 12.1) return 11.8;
      if (avgSpeed <= 12.9) return 12.0;
      if (avgSpeed <= 13.8) return 12.5;
      if (avgSpeed <= 14.5) return 13.0;
      if (avgSpeed <= 15.5) return 14.8;
      if (avgSpeed <= 16.0) return 14.8;
      if (avgSpeed <= 17.7) return 16.8;
      if (avgSpeed <= 19.3) return 18.5;
      if (avgSpeed <= 20.9) return 19.8;
      if (avgSpeed <= 22.5) return 23.0;
      break;

    // https://pacompendium.com/bicycling/
    case "cycling":
      if (avgSpeed <= 8.85) return 3.5;
      if (avgSpeed <= 15.1) return 5.8;
      if (avgSpeed <= 19.3) return 6.8;
      if (avgSpeed <= 22.3) return 8.0;
      if (avgSpeed <= 25.6) return 10.0;
      if (avgSpeed <= 30.6) return 12.0;
      break;
  }
  return 0;
};

export const estimateCaloriesBurned = (
  exercise: Exercise,
  weight: number
): number => {
  const { type, avg_speed, distance, start_time, end_time, duration } =
    exercise;

  if (
    !type ||
    !avg_speed ||
    !distance ||
    !start_time ||
    !end_time ||
    !duration
  ) {
    return 0;
  }

  console.log("user weight: ", weight);

  const met = metabolicEquivalentOfTask(type, avg_speed);
  if (met <= 0) return 0;

  const caloriesPerMinute = (met * 3.5 * weight) / 200;
  const durationMinutes = duration / 60;
  return Math.round(caloriesPerMinute * durationMinutes);
};
