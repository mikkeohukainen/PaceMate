import { Exercise, CompletedExercise, RoutePoint } from "./database";
import { exerciseQueries } from "./exercises";
import { routePointQueries } from "./routePoints";
import haversine from "haversine";

export type LocationPoint = {
  timestamp: string;
  latitude: number;
  longitude: number;
};

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
  type: string,
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

// this function calculates the total distance from location points array
export const calculateTotalDistance = (points: LocationPoint[]): number => {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    const segmentDistance = haversine(
      { latitude: currentPoint.latitude, longitude: currentPoint.longitude },
      { latitude: nextPoint.latitude, longitude: nextPoint.longitude },
      { unit: "km" }
    );

    totalDistance += segmentDistance;
  }
  return parseFloat(totalDistance.toFixed(3));
};

//converts location point to route points by adding exercise id
export const convertToRoutePoints = (
  exerciseId: number,
  locationPoints: LocationPoint[]
): RoutePoint[] => {
  return locationPoints.map((point) => ({
    exercise_id: exerciseId,
    timestamp: new Date(point.timestamp).toISOString(),
    latitude: point.latitude,
    longitude: point.longitude,
  }));
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
  const routePoint = {
    exercise_id: exerciseId,
    timestamp: new Date(locationPoint.timestamp).toISOString(),
    latitude: locationPoint.latitude,
    longitude: locationPoint.longitude,
  };
  await routePointQueries.create(routePoint);
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
