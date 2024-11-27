import { CompletedExercise, Exercise, ExerciseType } from "@/lib/exercise";
import { exerciseQueries } from "./exercises";
import { routePointQueries } from "./routePoints";
import {
  calculateTotalDistance,
  convertToRoutePoints,
  LocationPoint,
  RoutePoint,
} from "@/lib/route";

// use this to start a new exercise and get the id
export const startExerciseAndGetID = () => exerciseQueries.createEmpty();

// use this to finish an exercise, need to generate exerciseData first
export const finishExercise = (exerciseData: CompletedExercise) =>
  exerciseQueries.update(exerciseData);

// use this to generate exercise data after completion using locationPoints
export const generateExerciseData = async (
  exerciseID: number,
  type: string,
  steps: number
): Promise<CompletedExercise> => {
  const locationPoints = await routePointQueries.findByExerciseId(exerciseID);

  if (!locationPoints.length) {
    throw new Error("No location points found for exercise");
  }

  const startTime = new Date(locationPoints[0].timestamp);
  const endTime = new Date(locationPoints[locationPoints.length - 1].timestamp);
  const durationInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  const totalDistanceKm = calculateTotalDistance(locationPoints);
  const averageSpeedKmh = parseFloat(
    (totalDistanceKm / (durationInSeconds / 3600)).toFixed(2)
  );

  return {
    id: exerciseID,
    type: type,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    duration: durationInSeconds,
    distance: totalDistanceKm || null,
    avg_speed: averageSpeedKmh || null,
    steps: steps,
  };
};

// this one can be used to save exercise AFTER COMPLETION using locationPoints
// keep this here as backup
export const saveExerciseWithRoute = async (
  type: ExerciseType,
  locationPoints: LocationPoint[],
  steps: number
): Promise<number> => {
  if (!locationPoints.length) {
    throw new Error("No location points to save");
  }

  const startTime = new Date(locationPoints[0].timestamp);
  const endTime = new Date(locationPoints[locationPoints.length - 1].timestamp);
  const durationInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  const totalDistanceKm = calculateTotalDistance(locationPoints);
  const averageSpeedKmh = parseFloat(
    (totalDistanceKm / (durationInSeconds / 3600)).toFixed(2)
  );

  const newExercise: Omit<Exercise, "id"> = {
    type,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    duration: durationInSeconds,
    distance: totalDistanceKm,
    avg_speed: averageSpeedKmh,
    steps,
  };

  const exerciseId = await exerciseQueries.create(newExercise);
  const routePoints = convertToRoutePoints(exerciseId, locationPoints);
  await routePointQueries.bulkCreate(routePoints);
  console.log("Exercise saved with route points:", exerciseId);
  return exerciseId;
};

// save array of route points for an exercise
export const saveRoutePoints = async (
  exerciseId: number,
  locationPoints: LocationPoint[]
): Promise<void> => {
  const routePoints = convertToRoutePoints(exerciseId, locationPoints);
  await routePointQueries.bulkCreate(routePoints);
};

export const saveSingleRoutePoint = async (
  exerciseId: number,
  locationPoint: LocationPoint
): Promise<void> => {
  await routePointQueries.create({
    exercise_id: exerciseId,
    timestamp: new Date(locationPoint.timestamp).toISOString(),
    latitude: locationPoint.latitude,
    longitude: locationPoint.longitude,
  });
};

// get all exercises in a date range
export const getExercisesInDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Exercise[]> => {
  const allExercises = await exerciseQueries.findAll();
  return allExercises.filter((exercise) => {
    const exerciseDate = new Date(exercise.start_time!);
    return exerciseDate >= startDate && exerciseDate <= endDate;
  });
};

export const deleteExercise = async (exerciseId: number): Promise<void> => {
  await routePointQueries.deleteByExerciseId(exerciseId);
  await exerciseQueries.delete(exerciseId);
};

export const getAllExercises = async (): Promise<Exercise[]> => {
  return await exerciseQueries.findAll();
};

export const getExerciseById = async (
  exerciseId: number
): Promise<Exercise | null> => {
  return await exerciseQueries.findById(exerciseId);
};

export const getRoutePointsByExerciseId = async (
  exerciseId: number
): Promise<RoutePoint[]> => {
  return await routePointQueries.findByExerciseId(exerciseId);
};

export const getLastExerciseTime = async (): Promise<string | null> => {
  try {
    const exercises: Exercise[] = await exerciseQueries.findAll();
    if (exercises.length > 0) {
      return exercises[0].end_time || exercises[0].start_time || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching last exercise time:", error);
    return null;
  }
};
