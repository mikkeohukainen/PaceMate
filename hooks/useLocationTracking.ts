import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { LocationPoint } from "@/database/exerciseService";

const useLocationTracking = (
  isTracking: boolean
): [LocationPoint[], () => void] => {
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );

  useEffect(() => {
    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location: Location.LocationObject) => {
          console.log("New location: ", location);
          setLocationPoints((currentPoints) => [
            ...currentPoints,
            {
              timestamp: new Date(location.timestamp).toISOString(),
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          ]);
        }
      );
    };

    if (isTracking) {
      startTracking();
    } else if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [isTracking]);

  const resetLocationPoints = () => {
    setLocationPoints([]);
  };

  return [locationPoints, resetLocationPoints];
};

export default useLocationTracking;
