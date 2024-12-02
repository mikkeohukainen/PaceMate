import { estimateCaloriesBurned } from "@/lib/calories";
import { Exercise } from "@/lib/exercise";
import { UserProfile } from "@/lib/profile";
import { LocationPoint } from "@/lib/route";
import { capitalize } from "@/lib/util";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import MapRoute from "../gps/MapRoute";
import { memo, useMemo } from "react";

type ExerciseOverviewProps = {
  exercise: Exercise | null;
  userProfile: UserProfile | null;
  routePoints: LocationPoint[];
};

function ExerciseOverview({
  exercise,
  userProfile,
  routePoints,
}: ExerciseOverviewProps) {
  const caloriesBurned = useMemo(() => {
    if (!exercise || !userProfile?.weight) {
      return 0;
    }
    return estimateCaloriesBurned(exercise, userProfile.weight);
  }, [exercise, userProfile]);

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
        <Text variant="headlineMedium">
          {capitalize(exercise.type ?? "Exercise")}
        </Text>
        <Text>Date: {formattedDate}</Text>
        <Text>Time: {formattedTime}</Text>
        <Text>Duration: {exercise.duration?.toFixed(2)} seconds</Text>
        <Text>Distance: {exercise.distance?.toFixed(2)} km</Text>
        <Text>Average Speed: {exercise.avg_speed?.toFixed(2)} km/h</Text>
        <Text>Steps: {exercise.steps ?? "N/A"}</Text>
        <Text>Calories burned: {caloriesBurned}</Text>
        {routePoints.length > 0 ? (
          <View style={styles.mapContainer}>
            <MapRoute
              locationPoints={routePoints}
              showsUserLocation={false}
              followsUserLocation={false}
              showMarkers={true}
            />
          </View>
        ) : (
          <Text>No route data available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

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

export default memo(ExerciseOverview);
