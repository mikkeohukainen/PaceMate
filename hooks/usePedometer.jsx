import { useState, useRef } from "react";
import { Pedometer } from "expo-sensors";

const usePedometer = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);
  const subscription = useRef(null);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(isAvailable);

    if (isAvailable) {
      return Pedometer.watchStepCount((result) => {
        setCurrentSteps(result.steps);
      });
    }
    return null;
  };

  const saveSteps = async (steps) => {
    console.log("tracking stopped, steps: ", steps);
    // TODO: Save steps to device
  };

  const startSubscription = async () => {
    if (!subscription.current) {
      subscription.current = await subscribe();
    }
  };

  const stopSubscription = async () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
      setCurrentSteps(0);
    }
  };

  return {
    currentSteps,
    isPedometerAvailable,
    saveSteps,
    startSubscription,
    stopSubscription,
  };
};

export default usePedometer;
