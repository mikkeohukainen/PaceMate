import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Pedometer } from "expo-sensors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Track_walk() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription && subscription.remove();
  }, []);

  if (!isPedometerAvailable) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>
          Pedometer is not available on this device
        </ThemedText>
      </ThemedView>
    );
  } else {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>Steps: {currentStepCount}</ThemedText>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
});
