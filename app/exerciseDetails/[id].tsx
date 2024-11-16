import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { Exercise } from "@/database/database";
import {
  getExerciseById,
  getRoutePointsByExerciseId,
  LocationPoint,
} from "@/database/exerciseService";
import MapRoute from "@/components/gps/MapRoute";

const ExerciseDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [routePoints, setRoutePoints] = useState<LocationPoint[]>([]);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        if (id) {
          const exerciseData = await getExerciseById(Number(id));
          setExercise(exerciseData);

          const routeData = await getRoutePointsByExerciseId(Number(id));
          const locationPoints: LocationPoint[] = routeData.map((point) => ({
            timestamp: point.timestamp,
            latitude: point.latitude,
            longitude: point.longitude,
          }));
          setRoutePoints(locationPoints);
        } else {
          console.error("No exercise ID provided.");
        }
      } catch (error) {
        console.error("Error fetching exercise details:", error);
      }
    };

    fetchExerciseDetails();
  }, [id]);

  if (!exercise) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading exercise details...</Text>
      </View>
    );
  }

  const startTime = new Date(exercise.start_time || "");
  const formattedDate = startTime.toLocaleDateString();
  const formattedTime = startTime.toLocaleTimeString();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text variant="headlineMedium">{exercise.type || "Exercise"}</Text>
        <Text>Date: {formattedDate}</Text>
        <Text>Time: {formattedTime}</Text>
        <Text>Duration: {exercise.duration?.toFixed(2)} seconds</Text>
        <Text>Distance: {exercise.distance?.toFixed(2)} km</Text>
        <Text>Average Speed: {exercise.avg_speed?.toFixed(2)} km/h</Text>
        <Text>Steps: {exercise.steps ?? "N/A"}</Text>

        {routePoints.length > 0 ? (
          <View style={styles.mapContainer}>
            <MapRoute locationPoints={routePoints} />
          </View>
        ) : (
          <Text>No route data available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
    marginTop: 16,
  },
});

export default ExerciseDetailsScreen;
