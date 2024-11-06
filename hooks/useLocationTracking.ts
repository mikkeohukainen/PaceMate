import * as Location from "expo-location";
import { useEffect, useState } from "react";

type LocationPoint = {
  latitude: number;
  longitude: number;
};

const useLocationTracking = (): LocationPoint[] => {
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
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
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          ]);
        }
      );

      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);

  return locationPoints;
};

export default useLocationTracking;
