import { StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [activity, setActivity] = useState("");

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Select an activity</ThemedText>
      </ThemedView>
      <SegmentedButtons
        value={activity}
        onValueChange={setActivity}
        buttons={[
          {
            value: "walk",
            label: "Walking",
          },
          {
            value: "run",
            label: "Running",
          },
          { value: "cycle", label: "Cycling" },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
