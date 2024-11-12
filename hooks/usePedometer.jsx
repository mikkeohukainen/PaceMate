import { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";

const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(isAvailable);

    if (isAvailable) {
      return Pedometer.watchStepCount((result) => {
        setCurrentSteps(result.steps);
      });
    }
  };

  const resetSteps = () => {
    setCurrentSteps(0);
  };

  const saveSteps = async (steps) => {
    console.log("tracking stopped, steps: ", steps);
    // TODO: Save steps to device
  };

  useEffect(() => {
    let subscription;

    const initializeSubscription = async () => {
      subscription = await subscribe();
    };

    initializeSubscription();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { currentSteps, isPedometerAvailable, resetSteps, saveSteps };
};

export default usePedometer;
