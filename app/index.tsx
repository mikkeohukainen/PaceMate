import { useRouter } from "expo-router";
import { useEffect, useContext, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Appbar, FAB, useTheme, Text } from "react-native-paper";
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
import ExerciseCalendar from "@/components/ExerciseCalendar";

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
        ToastAndroid.show("Exercise saved", ToastAndroid.SHORT);
        resetLocationPoints();
        setCurrentSteps(0);
      } catch (error) {
        console.error("Error saving exercise:", error);
        ToastAndroid.show("Error saving exercise", ToastAndroid.SHORT);
      }
    } else {
      console.warn("No location points to save");
      ToastAndroid.show("No data to save", ToastAndroid.SHORT);
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
    ToastAndroid.show("Exercise discarded", ToastAndroid.SHORT);
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

        <View style={styles.mapCalendarContainer}>
          {locationPoints.length > 0 && (
            <MapRoute locationPoints={locationPoints} />
          )}
          {!isTracking && !modalVisible && <ExerciseCalendar />}
        </View>

        <FAB
          icon={isTracking ? "stop" : "record"}
          label={isTracking ? "Stop" : "Start"}
          onPress={() => {
            if (isTracking) {
              ToastAndroid.show("Long press to stop", ToastAndroid.SHORT);
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
  mapCalendarContainer: {
    flex: 1,
    marginTop: 16,
  },
});
