import { useRouter } from "expo-router";
import { useEffect, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, FAB, useTheme, Text } from "react-native-paper";
import Toast from "react-native-root-toast";
import { initDB } from "@/database/database";
import { ExerciseContext } from "@/context/ExerciseContext";
import useLocationTracking from "@/hooks/useLocationTracking";
import usePedometer from "@/hooks/usePedometer";
import MapRoute from "@/components/gps/MapRoute";
import {
  saveExerciseWithRoute,
  getAllExercises,
} from "@/database/exerciseService";
import SaveExerciseModal from "@/components/SaveExerciseModal";
import {
  checkIfUserProfileInitialized,
  deleteUserProfile,
} from "@/hooks/useUserProfile";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {
    isTracking,
    setIsTracking,
    locationPoints,
    resetLocationPoints,
    currentSteps,
    setCurrentSteps,
  } = useContext(ExerciseContext);

  useEffect(() => {
    (async () => {
      await initDB();
      console.log("Database initialized");
      // await deleteUserProfile(); // Delete user profile for testing
      await checkIfUserProfileInitialized(); // Initialize profile if not already done
    })();
  }, []);

  useLocationTracking();
  usePedometer();

  const handleStopTracking = () => {
    setIsTracking(false);
    setModalVisible(true);
  };

  const handleSaveExercise = async (exerciseType: string) => {
    setModalVisible(false);

    // Save the data to SQLite
    if (locationPoints.length > 0) {
      try {
        const exerciseId = await saveExerciseWithRoute(
          exerciseType,
          locationPoints,
          currentSteps
        );
        console.log("Exercise saved with ID:", exerciseId);
        Toast.show("Exercise saved", {
          duration: Toast.durations.SHORT,
        });
        resetLocationPoints();
        setCurrentSteps(0);
      } catch (error) {
        console.error("Error saving exercise:", error);
        Toast.show("Error saving exercise", {
          duration: Toast.durations.SHORT,
        });
      }
    } else {
      console.warn("No location points to save");
      Toast.show("No data to save", {
        duration: Toast.durations.SHORT,
      });
    }
    try {
      const exercises = await getAllExercises();
      console.log("All exercises:", exercises);
    } catch (error) {
      console.error("Error getting all exercises:", error);
    }
  };

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  const handleCancelSave = () => {
    setModalVisible(false);
    resetLocationPoints();
    setCurrentSteps(0);
    Toast.show("Exercise discarded", {
      duration: Toast.durations.SHORT,
    });
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
        <Appbar.Action
          icon="history"
          onPress={() => router.push("/exercises")}
        />
        <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
      </Appbar.Header>
      <View style={styles.content}>
        {/* Pedometer test */}
        {currentSteps > 0 && isTracking ? (
          <Text>{currentSteps}</Text>
        ) : (
          <Text>Pedometer not in use</Text>
        )}
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
              handleStartTracking();
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
        <SaveExerciseModal
          visible={modalVisible}
          onDismiss={handleCancelSave}
          onSave={handleSaveExercise}
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
