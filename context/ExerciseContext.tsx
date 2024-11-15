import React, { createContext, useState, ReactNode } from "react";
import { LocationPoint } from "@/database/exerciseService";

interface ExerciseProviderProps {
  children: ReactNode;
}

interface ExerciseContextType {
  locationPoints: LocationPoint[];
  isTracking: boolean;
  currentSteps: number;
  setCurrentSteps: (steps: number) => void;
  setIsTracking: (isTracking: boolean) => void;
  addLocationPoint: (point: LocationPoint) => void;
  resetLocationPoints: () => void;
}

export const ExerciseContext = createContext<ExerciseContextType>({
  locationPoints: [],
  isTracking: false,
  currentSteps: 0,
  setCurrentSteps: () => {},
  setIsTracking: () => {},
  addLocationPoint: () => {},
  resetLocationPoints: () => {},
});

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({
  children,
}) => {
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);

  const addLocationPoint = (point: LocationPoint) => {
    setLocationPoints((prevPoints) => [...prevPoints, point]);
  };

  const resetLocationPoints = () => {
    setLocationPoints([]);
  };

  return (
    <ExerciseContext.Provider
      value={{
        locationPoints,
        isTracking,
        currentSteps,
        setCurrentSteps,
        setIsTracking,
        addLocationPoint,
        resetLocationPoints,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};
