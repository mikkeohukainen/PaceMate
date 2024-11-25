import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { getAllExercises } from "@/database/exerciseService";
import { Exercise } from "@/lib/exercise";
import { ExerciseItem } from "@/components/ExerciseItem";
// import { format } from "date-fns";

/*
TODO:
    Format date?
    Format card content?
 */

export default function ExercisesScreen() {
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

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={exercises}
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
});
