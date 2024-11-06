import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapRoute from "@/components/gps/MapRoute";
import useLocationTracking from "@/hooks/useLocationTracking";

export default function GpsTest() {
  const locationPoints = useLocationTracking();

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Test gps and map</ThemedText>
      </ThemedView>

      {locationPoints.length === 0 && <ThemedText>Connecting...</ThemedText>}

      {/*Text that displays the last item in locationPoints array for debuggin*/}

      <ThemedText>
        Last location:{" "}
        {locationPoints.length > 0
          ? `${locationPoints[locationPoints.length - 1].latitude}, ${locationPoints[locationPoints.length - 1].longitude}`
          : "No location yet"}
      </ThemedText>

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
