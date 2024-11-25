import * as Location from "expo-location";
import { useEffect, useRef, useContext } from "react";
import { ExerciseContext } from "@/context/ExerciseContext";

export const GPS_TRACKING_THRESHOLD = 20; // threshold for GPS accuracy in meters (lower is better), location points with higher accuracy value will be discarded

const useLocationTracking = () => {
  const { addLocationPoint, isTracking, resetLocationPoints, updateAccuracy } =
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
      updateAccuracy(-1); // reset accuracy

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location: Location.LocationObject) => {
          const accuracy = location.coords.accuracy || -1;
          console.log("New location. Accuracy:", accuracy);
          updateAccuracy(accuracy);

          if (accuracy > GPS_TRACKING_THRESHOLD) {
            console.log(
              "Discarding location point due to low accuracy. Limit:",
              GPS_TRACKING_THRESHOLD
            );
            return;
          }

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
