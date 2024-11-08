import { StyleSheet, Button } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapRoute from "@/components/gps/MapRoute";
import useLocationTracking from "@/hooks/useLocationTracking";

export default function GpsTest() {
  const [isTracking, setIsTracking] = useState(false);
  const [locationPoints, resetLocationPoints] = useLocationTracking(isTracking);

  const handleStart = () => {
    resetLocationPoints();
    setIsTracking(true);
  };

  const handleStop = () => {
    setIsTracking(false);
  };

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Test GPS and Map</ThemedText>
      </ThemedView>

      {locationPoints.length === 0 && isTracking && (
        <ThemedText>Connecting...</ThemedText>
      )}

      <ThemedText>
        Last location:{" "}
        {locationPoints.length > 0
          ? `${locationPoints[locationPoints.length - 1].latitude}, ${locationPoints[locationPoints.length - 1].longitude}`
          : "No location yet"}
      </ThemedText>

      {isTracking ? (
        <Button title="Stop Tracking" onPress={handleStop} />
      ) : (
        <Button title="Start Tracking" onPress={handleStart} />
      )}

      <ThemedView style={styles.mapContainer}>
        {locationPoints.length > 0 && (
          <MapRoute locationPoints={locationPoints} />
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 16,
    padding: 32,
  },
  mapContainer: {
    flex: 1,
    marginTop: 16,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
