import { useRef, useContext, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import { Subscription } from "expo-modules-core";
import { ExerciseContext } from "@/context/ExerciseContext";

const usePedometer = () => {
  const pedometerSubscription = useRef<Subscription | null>(null);

  const { isTracking, setCurrentSteps, currentSteps } =
    useContext(ExerciseContext);

  useEffect(() => {
    const startPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        console.error("Pedometer is not available on this device");
        return;
      }

      setCurrentSteps(0);

      pedometerSubscription.current = Pedometer.watchStepCount(
        (result: Pedometer.PedometerResult) => {
          setCurrentSteps(result.steps);
        }
      );
    };

    const stopPedometer = () => {
      if (pedometerSubscription.current) {
        pedometerSubscription.current.remove();
        pedometerSubscription.current = null;
        console.log("tracking stopped, steps: ", currentSteps);
        setCurrentSteps(0);
      }
    };

    if (isTracking) {
      startPedometer();
    } else {
      stopPedometer();
    }

    return () => {
      stopPedometer();
    };
  }, [isTracking]);
  // 'currentSteps' and 'setCurrentSteps' should be memoized before adding them to the dependency array.
};

export default usePedometer;
