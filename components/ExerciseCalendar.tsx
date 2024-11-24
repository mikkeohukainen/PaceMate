import React, { useState, useEffect, useCallback } from "react";
import { Agenda, AgendaEntry } from "react-native-calendars";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAllExercises } from "@/database/exerciseService";
import { Exercise } from "@/database/database";
import { useRouter } from "expo-router";
import { format } from "date-fns";

interface MyAgendaEntry extends AgendaEntry {
  exerciseId: number;
  exercise: Exercise;
}

interface MyAgendaSchedule {
  [key: string]: MyAgendaEntry[];
}

const CalendarScreen: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [items, setItems] = useState<MyAgendaSchedule>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { marked: boolean };
  }>({});
  const router = useRouter();

  const fetchExercises = useCallback(async () => {
    try {
      const data = await getAllExercises();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  }, [fetchExercises]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  useEffect(() => {
    const loadItems = () => {
      const newItems: MyAgendaSchedule = {};
      const newMarkedDates: { [key: string]: { marked: boolean } } = {};

      exercises.forEach((exercise) => {
        const dateKey = exercise.start_time?.split("T")[0];
        if (!dateKey) return;

        if (!newItems[dateKey]) {
          newItems[dateKey] = [];
        }

        newItems[dateKey].push({
          name: exercise.type || "Exercise",
          exerciseId: exercise.id,
          height: 75,
          exercise,
        } as MyAgendaEntry);

        newMarkedDates[dateKey] = { marked: true };
      });

      setItems(newItems);
      setMarkedDates(newMarkedDates);
    };

    if (exercises.length > 0) {
      loadItems();
    }
  }, [exercises]);

  const renderItem = (reservation: AgendaEntry) => {
    const { exercise } = reservation as MyAgendaEntry;
    if (!exercise) return <View />;

    const startTime = new Date(exercise.start_time || "");
    const formattedTime = format(startTime, "pp");

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          router.push({
            pathname: "/exerciseDetails/[id]",
            params: { id: exercise.id.toString() },
          });
        }}
      >
        <View>
          <Text style={styles.itemTitle}>{exercise.type || "Exercise"}</Text>
          <Text style={styles.itemText}>Time: {formattedTime}</Text>
          <Text style={styles.itemText}>
            Duration: {exercise.duration?.toFixed(2)} s
          </Text>
          <Text style={styles.itemText}>
            Distance: {exercise.distance?.toFixed(2)} km
          </Text>
          <Text style={styles.itemText}>
            Avg Speed: {exercise.avg_speed?.toFixed(2)} km/h
          </Text>
          <Text style={styles.itemText}>Steps: {exercise.steps ?? "N/A"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyData = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No exercises for this day.</Text>
      </View>
    );
  };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    const entry1 = r1 as MyAgendaEntry;
    const entry2 = r2 as MyAgendaEntry;
    return entry1.exerciseId !== entry2.exerciseId;
  };

  return (
    <Agenda
      items={items}
      selected={new Date().toISOString().split("T")[0]}
      renderItem={renderItem}
      rowHasChanged={rowHasChanged}
      markedDates={markedDates}
      renderEmptyData={renderEmptyData}
      pastScrollRange={3}
      futureScrollRange={1}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

const styles = StyleSheet.create({
  emptyDate: {
    flex: 1,
    height: 15,
    margin: 30,
  },
  item: {
    backgroundColor: "white",
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17,
    padding: 10,
  },
  itemText: {
    fontSize: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CalendarScreen;
