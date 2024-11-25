import haversine from "haversine";

export type LocationPoint = {
  timestamp: string;
  latitude: number;
  longitude: number;
};

export interface RoutePoint {
  exercise_id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
}

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

export const calculateTimeInHours = (
  locationPoints: LocationPoint[]
): number => {
  const startTime = new Date(locationPoints[0].timestamp).getTime();
  const endTime = new Date(
    locationPoints[locationPoints.length - 1].timestamp
  ).getTime();
  return (endTime - startTime) / 1000 / 60 / 60;
};
