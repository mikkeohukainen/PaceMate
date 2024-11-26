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
import { checkIfUserProfileInitialized } from "@/lib/profile";
import ExerciseStats from "@/components/exerciseStats/ExerciseStats";
import GpsAccuracyIndicator from "@/components/gps/AccuracyIndicator";
import { ExerciseType } from "@/lib/exercise";

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
    currentAccuracy,
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

  const handleSaveExercise = async (exerciseType: ExerciseType) => {
    setModalVisible(false);

    // Save the data to SQLite
    // changed this from 0 to 1. At least 2 points are needed to calculate duration etc
    if (locationPoints.length > 1) {
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
        {locationPoints.length === 0 && isTracking && (
          <>
            <Text style={styles.startingExerciseText}>
              Starting Exercise...
            </Text>
            <GpsAccuracyIndicator accuracy={currentAccuracy} />
          </>
        )}
        <View style={styles.mapCalendarContainer}>
          {locationPoints.length > 0 && (
            <>
              <ExerciseStats />
              <GpsAccuracyIndicator accuracy={currentAccuracy} />
              <MapRoute
                locationPoints={locationPoints}
                showsUserLocation
                followsUserLocation
              />
            </>
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
    padding: 8,
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
  mapCalendarContainer: {
    flex: 1,
  },
  startingExerciseText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
