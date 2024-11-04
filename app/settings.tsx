import { StyleSheet } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SegmentedButtons, Switch } from "react-native-paper";

export default function SettingsScreen() {
  const [value, setValue] = useState("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Settings</ThemedText>
      </ThemedView>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: "walk",
            label: "Walking",
          },
          {
            value: "train",
            label: "Transit",
          },
          { value: "drive", label: "Driving" },
        ]}
      />
      <Switch
        value={isSwitchOn}
        onValueChange={() => setIsSwitchOn(!isSwitchOn)}
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
