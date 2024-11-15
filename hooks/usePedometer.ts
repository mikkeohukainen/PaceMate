import { useRef, useContext, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import { Subscription } from "expo-modules-core";
import { ExerciseContext } from "@/context/ExerciseContext";

const usePedometer = () => {
  // const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  // const subscription = useRef(null);
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

  //   const subscribe = async () => {
  //     const isAvailable = await Pedometer.isAvailableAsync();
  //     setIsPedometerAvailable(isAvailable);

  //     if (isAvailable) {
  //       return Pedometer.watchStepCount((result) => {
  //         setCurrentSteps(result.steps);
  //       });
  //     }
  //     return null;
  //   };

  //   const saveSteps = async () => {
  //     console.log("tracking stopped, steps: ", currentSteps);
  //     // TODO: Save steps to device
  //   };

  //   const startPedometer = async () => {
  //     if (!subscription.current) {
  //       subscription.current = await subscribe();
  //     }
  //   };

  //   const stopPedometer = async () => {
  //     if (subscription.current) {
  //       subscription.current.remove();
  //       subscription.current = null;
  //       setCurrentSteps(0);
  //     }
  //   };

  //   return {
  //     currentSteps,
  //     isPedometerAvailable,
  //     saveSteps,
  //     startPedometer,
  //     stopPedometer,
  //   };
};

export default usePedometer;
