import * as Location from "expo-location";
import { useEffect, useRef, useContext } from "react";
import { ExerciseContext } from "@/context/ExerciseContext";

const useLocationTracking = () => {
  const { addLocationPoint, isTracking, resetLocationPoints } =
    useContext(ExerciseContext);
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

      resetLocationPoints();

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location: Location.LocationObject) => {
          console.log("New location: ", location);
          addLocationPoint({
            timestamp: new Date(location.timestamp).toISOString(),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
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
  /*WARNING
  App crashes if 'addLocationPoint' and 'resetLocationPoints' are added to the dependency array.
  */
};

export default useLocationTracking;
