import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Text, SegmentedButtons, IconButton } from "react-native-paper";
import { getAllExercises } from "@/database/exerciseService";
import { Exercise } from "@/lib/exercise";
import { ExerciseItem } from "@/components/ExerciseItem";
import Summary from "../components/summary/Summary";

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showSummary, setShowSummary] = useState<boolean>(false);

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
    return exercises.filter(
      (exercise) =>
        exercise.type === selectedType ||
        exercise.type === selectedType.toLowerCase()
    );
  };

  const handleFilterChange = (value: string) => {
    if (value !== selectedType) {
      setShowSummary(false);
      setSelectedType(value);
    }
  };

  const handleSummaryToggle = () => {
    setShowSummary(!showSummary);

    // if goinf from showSummary to !showSummary reset selectedType to "all"
    // otherwise clear selectedType
    if (showSummary) {
      setSelectedType("all");
    } else {
      setSelectedType("");
    }
  };

  const filteredExercises = getFilteredExercises();

  // filter button for each exercise type + toggle for showing summary stats
  const filterControls = (
    <View style={styles.filterContainer}>
      <SegmentedButtons
        value={selectedType}
        onValueChange={handleFilterChange}
        buttons={[
          { value: "all", label: "ALL" },
          { value: "Walking", icon: "walk" },
          { value: "Running", icon: "run" },
          { value: "Cycling", icon: "bike" },
        ]}
        style={styles.segmentedButtons}
      />
      <IconButton
        icon="chart-bar"
        mode={showSummary ? "contained" : "outlined"}
        selected={showSummary}
        onPress={handleSummaryToggle}
      />
    </View>
  );

  // content is either a list of exercises or a summary of all exercises
  const content = showSummary ? (
    <ScrollView>
      <Summary exercises={exercises} />
    </ScrollView>
  ) : (
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
  );

  return (
    <View>
      {filterControls}
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  filterContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  segmentedButtons: {
    flex: 1,
  },
});
