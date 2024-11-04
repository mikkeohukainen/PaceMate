import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Calendar } from "react-native-calendars";

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Session history</ThemedText>
      </ThemedView>
      <Calendar
        style={{
          borderWidth: 2,
          borderColor: "gray",
          height: 350,
        }}
        onDayPress={(day) => {
          alert(day.dateString);
        }}
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
    flexDirection: "row",
    gap: 8,
  },
});
