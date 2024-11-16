import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { List, Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { getAllExercises } from "@/database/exerciseService";
import { Exercise } from "@/database/database";
// import { format } from "date-fns";

/*
TODO: 
    Format date?
    Format card content?
 */

const ExercisesScreen: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await getAllExercises();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    const startTime = new Date(item.start_time || "");
    // Example: "Jan 1, 2020, 12:00 PM"
    // const formattedDate = format(startTime, "PPP, p");

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
          title={`${item.type || "Exercise"} on ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`}
          left={(props) => (
            <List.Icon
              {...props}
              icon={
                item.type?.toLowerCase() === "walking"
                  ? "walk"
                  : item.type?.toLowerCase() === "cycling"
                    ? "bike"
                    : "run"
              }
            />
          )}
        />
        <Card.Content>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Duration: {item.duration?.toFixed(2)} s
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

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExerciseItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchExercises} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No exercises recorded.</Text>
          </View>
        }
        contentContainerStyle={exercises.length === 0 && styles.container}
        style={styles.container}
      />
    </View>
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
  container: {
    flexGrow: 1,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});

export default ExercisesScreen;
