import { Exercise } from "@/lib/exercise";
import { capitalize } from "@/lib/util";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Card, List, Text } from "react-native-paper";

type ExerciseItemProps = {
  item: Exercise;
};

export const ExerciseItem = ({ item }: ExerciseItemProps) => {
  const router = useRouter();
  const startTime = new Date(item.start_time || "");

  const formatTime = (seconds: number): string => {
    const secondsInt = Math.round(seconds);
    const hrs = Math.floor(secondsInt / 3600);
    const mins = Math.floor((secondsInt % 3600) / 60);
    const secs = secondsInt % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "/exerciseDetails/[id]",
          params: { id: item.id.toString() },
        });
      }}
    >
      <Card.Title
        title={`${capitalize(item.type ?? "Exercise")}`}
        subtitle={`${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`}
        left={(props) => (
          <List.Icon
            {...props}
            icon={
              item.type === "walking"
                ? "walk"
                : item.type === "cycling"
                  ? "bike"
                  : "run"
            }
          />
        )}
      />
      <Card.Content>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            Duration: {formatTime(item.duration ?? 0)}
          </Text>
          <Text style={styles.cardText}>
            Distance: {item.distance?.toFixed(2)} km
          </Text>
          <Text style={styles.cardText}>
            Avg Speed: {item.avg_speed?.toFixed(2)} km/h
          </Text>
          <Text style={styles.cardText}>Steps: {item.steps ?? "N/A"}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardText: {
    flexBasis: "50%",
    marginVertical: 2,
  },
});
