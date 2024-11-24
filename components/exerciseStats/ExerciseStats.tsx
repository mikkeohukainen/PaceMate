import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { ExerciseContext } from "@/context/ExerciseContext";
import haversine from "haversine";
import StatCard from "./StatCard";

const ExerciseStats: React.FC = () => {
  const { locationPoints, currentSteps, isTracking } =
    useContext(ExerciseContext);
  const [distance, setDistance] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [averageSpeed, setAverageSpeed] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isTracking) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setTime(0);
      setAverageSpeed(0);
      setDistance(0);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTracking]);

  useEffect(() => {
    const nrOfPoints = locationPoints.length;
    if (nrOfPoints < 2) return;

    const calculateStats = (): void => {
      const calculateTotalDistance = () => {
        let totalDistance = 0;
        for (let i = 0; i < nrOfPoints - 1; i++) {
          const startPoint = {
            latitude: locationPoints[i].latitude,
            longitude: locationPoints[i].longitude,
          };
          const endPoint = {
            latitude: locationPoints[i + 1].latitude,
            longitude: locationPoints[i + 1].longitude,
          };
          totalDistance += haversine(startPoint, endPoint, { unit: "km" });
        }
        return totalDistance;
      };

      const calculateTimeInHours = () => {
        const startTime = new Date(locationPoints[0].timestamp).getTime();
        const endTime = new Date(
          locationPoints[nrOfPoints - 1].timestamp
        ).getTime();
        return (endTime - startTime) / 1000 / 60 / 60;
      };

      const totalDistance = calculateTotalDistance();
      const totalTimeHours = calculateTimeInHours();
      const averageSpeed =
        totalTimeHours > 0 ? totalDistance / totalTimeHours : 0;

      setAverageSpeed(averageSpeed);
      setDistance(totalDistance);
    };

    calculateStats();
  }, [locationPoints]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise in Progress</Text>
      <View style={styles.row}>
        <StatCard label="Duration" value={formatTime(time)} unit="" />
        <StatCard label="Distance" value={distance.toFixed(2)} unit="km" />
      </View>
      <View style={styles.row}>
        <StatCard
          label="Average Speed"
          value={averageSpeed.toFixed(2)}
          unit="km/h"
        />
        <StatCard label="Steps" value={currentSteps} unit="" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 16,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});

export default ExerciseStats;
