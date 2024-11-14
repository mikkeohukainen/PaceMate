import { useRouter } from "expo-router";
import { useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, FAB, useTheme, Text } from "react-native-paper";
import Toast from "react-native-root-toast";
import { initDB } from "@/database/database";
import { ExerciseContext } from "@/context/ExerciseContext";
import useLocationTracking from "@/hooks/useLocationTracking";
import MapRoute from "@/components/gps/MapRoute";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const { isTracking, setIsTracking, locationPoints } =
    useContext(ExerciseContext);

  useEffect(() => {
    (async () => {
      await initDB();
      console.log("Database initialized");
    })();
  }, []);

  useLocationTracking();

  const handleStopTracking = () => {
    setIsTracking(false);
    // Save the data to SQLite
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content
          title={
            <Text variant="headlineMedium">
              <Text
                style={{ ...styles.appTitle, color: theme.colors.onSurface }}
              >
                Pace
              </Text>
              <Text style={{ ...styles.appTitle, color: "orange" }}>Mate</Text>
            </Text>
          }
        />
        <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
      </Appbar.Header>
      <View style={styles.content}>
        {locationPoints.length === 0 && isTracking && (
          <Text>Connecting...</Text>
        )}
        <Text>
          Last location:{" "}
          {locationPoints.length > 0
            ? `${locationPoints[locationPoints.length - 1].latitude}, ${locationPoints[locationPoints.length - 1].longitude}`
            : "No location yet"}
        </Text>
        <View style={styles.mapContainer}>
          {locationPoints.length > 0 && (
            <MapRoute locationPoints={locationPoints} />
          )}
        </View>

        <FAB
          icon={isTracking ? "stop" : "record"}
          label={isTracking ? "Stop" : "Start"}
          onPress={() => {
            if (isTracking) {
              Toast.show("Long press to stop", {
                duration: Toast.durations.SHORT,
              });
            } else {
              setIsTracking(true);
            }
          }}
          onLongPress={() => {
            if (isTracking) {
              handleStopTracking();
            }
          }}
          color={isTracking ? theme.colors.onError : theme.colors.onPrimary}
          style={{
            ...styles.fab,
            backgroundColor: isTracking
              ? theme.colors.error
              : theme.colors.primary,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
  mapContainer: {
    flex: 1,
    marginTop: 16,
  },
});
