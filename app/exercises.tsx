import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, SegmentedButtons } from "react-native-paper";
import { getAllExercises } from "@/database/exerciseService";
import { Exercise } from "@/lib/exercise";
import { ExerciseItem } from "@/components/ExerciseItem";

/*
TODO:
    Format date?
    Format card content?
 */

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await getAllExercises();
      //filter out exercises with no duration or duration of 0
      const validData = data.filter(
        (exercise) => exercise.duration != null && exercise.duration !== 0
      );
      setExercises(validData);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const getFilteredExercises = () => {
    if (selectedType === "all") return exercises;
    return exercises.filter((exercise) => exercise.type === selectedType);
  };
  const filteredExercises = getFilteredExercises();

  return (
    <View style={{ flex: 1 }}>
      <SegmentedButtons
        value={selectedType}
        onValueChange={(value) => {
          if (value !== selectedType) setSelectedType(value);
        }}
        buttons={[
          {
            value: "all",
            label: "ALL",
          },
          {
            value: "Running",
            icon: "run",
          },
          {
            value: "Walking",
            icon: "walk",
          },
          {
            value: "Cycling",
            icon: "bike",
          },
        ]}
        style={styles.segmentedButtons}
      />
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ExerciseItem item={item} />}
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
}

const styles = StyleSheet.create({
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
  segmentedButtons: {
    marginHorizontal: 24,
    marginTop: 16,
  },
});
