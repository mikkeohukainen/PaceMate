import { useState, useEffect, useCallback } from "react";
import { Agenda, AgendaEntry } from "react-native-calendars";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { getAllExercises } from "@/database/exerciseService";
import { useRouter } from "expo-router";
import { Exercise } from "@/lib/exercise";
import { useTheme, Text } from "react-native-paper";
import { ExerciseItem } from "./ExerciseItem";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface MyAgendaEntry extends AgendaEntry {
  exerciseId: number;
  exercise: Exercise;
}

interface MyAgendaSchedule {
  [key: string]: MyAgendaEntry[];
}

const CalendarScreen = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [items, setItems] = useState<MyAgendaSchedule>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { marked: boolean };
  }>({});
  const router = useRouter();
  const theme = useTheme();

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

  const renderItem = useCallback(
    (reservation: AgendaEntry) => {
      const { exercise } = reservation as MyAgendaEntry;
      if (!exercise) return <View />;

      return (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/exerciseDetails/[id]",
              params: { id: exercise.id.toString() },
            });
          }}
        >
          <ExerciseItem item={exercise} />
        </TouchableOpacity>
      );
    },
    [router]
  );

  const renderEmptyData = useCallback(() => {
    return (
      <View style={styles.emptyDate}>
        <Icon
          name="emoticon-sad-outline"
          size={128}
          color={theme.colors.surfaceVariant}
        />
        <Text variant="bodyLarge">No exercises for this day.</Text>
      </View>
    );
  }, [theme.colors.surfaceVariant]);

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    const entry1 = r1 as MyAgendaEntry;
    const entry2 = r2 as MyAgendaEntry;
    return entry1.exerciseId !== entry2.exerciseId;
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.headerText}>
        Exercise history
      </Text>
      <Agenda
        items={items}
        selected={new Date().toISOString().split("T")[0]}
        renderItem={renderItem}
        rowHasChanged={rowHasChanged}
        markedDates={markedDates}
        renderEmptyData={renderEmptyData}
        pastScrollRange={2}
        futureScrollRange={1}
        onRefresh={onRefresh}
        showClosingKnob={true}
        refreshing={refreshing}
        style={{ borderRadius: theme.roundness }}
        theme={{
          agendaDayNumColor: theme.colors.onBackground,
          agendaDayTextColor: theme.colors.onBackground,
          agendaKnobColor: theme.colors.inversePrimary,
          textInactiveColor: theme.colors.onBackground,
          agendaTodayColor: theme.colors.primary,
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.elevation.level5,
          dayTextColor: theme.colors.onBackground,
          monthTextColor: theme.colors.onBackground,
          reservationsBackgroundColor: theme.colors.background,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.onPrimary,
          textSectionTitleColor: theme.colors.onBackground,
          todayDotColor: theme.colors.inversePrimary,
          todayTextColor: theme.colors.onBackground,
          selectedDotColor: theme.colors.inversePrimary,
          indicatorColor: theme.colors.secondary,
          dotColor: theme.colors.secondary,
          textDisabledColor: theme.colors.backdrop,
        }}
        // Workaround for https://github.com/wix/react-native-calendars/issues/1209
        key={theme.dark ? "dark" : "light"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyDate: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    margin: 16,
  },
});

export default CalendarScreen;
