import { createContext, useState, ReactNode } from "react";
import { LocationPoint } from "@/lib/route";

interface ExerciseProviderProps {
  children: ReactNode;
}

interface ExerciseContextType {
  locationPoints: LocationPoint[];
  isTracking: boolean;
  currentSteps: number;
  currentAccuracy: number;
  setCurrentSteps: (steps: number) => void;
  setIsTracking: (isTracking: boolean) => void;
  addLocationPoint: (point: LocationPoint) => void;
  resetLocationPoints: () => void;
  updateAccuracy: (accuracy: number) => void;
}

export const ExerciseContext = createContext<ExerciseContextType>({
  locationPoints: [],
  isTracking: false,
  currentSteps: 0,
  currentAccuracy: 0,
  setCurrentSteps: () => {},
  setIsTracking: () => {},
  addLocationPoint: () => {},
  resetLocationPoints: () => {},
  updateAccuracy: () => {},
});

export const ExerciseProvider = ({ children }: ExerciseProviderProps) => {
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(-1);

  const addLocationPoint = (point: LocationPoint) => {
    setLocationPoints((prevPoints) => [...prevPoints, point]);
  };

  const resetLocationPoints = () => {
    setLocationPoints([]);
  };

  const updateAccuracy = (accuracy: number) => {
    setCurrentAccuracy(accuracy);
  };

  return (
    <ExerciseContext.Provider
      value={{
        locationPoints,
        isTracking,
        currentSteps,
        currentAccuracy,
        setCurrentSteps,
        setIsTracking,
        addLocationPoint,
        resetLocationPoints,
        updateAccuracy,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};
