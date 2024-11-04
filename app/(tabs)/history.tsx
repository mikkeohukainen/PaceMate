import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Session history</ThemedText>
      </ThemedView>
      
      
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
});
