import { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { ExerciseContext } from "@/context/ExerciseContext";
import StatCard from "./StatCard";
import { calculateTimeInHours, calculateTotalDistance } from "@/lib/route";

const ExerciseStats = () => {
  const { locationPoints, currentSteps, isTracking } =
    useContext(ExerciseContext);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

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
    if (locationPoints.length < 2) return;
    const totalDistance = calculateTotalDistance(locationPoints);
    const totalTimeHours = calculateTimeInHours(locationPoints);
    const averageSpeed =
      totalTimeHours > 0 ? totalDistance / totalTimeHours : 0;
    setAverageSpeed(averageSpeed);
    setDistance(totalDistance);
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
