import { StyleSheet, View } from "react-native";
import { Exercise } from "@/lib/exercise";
import { capitalize } from "@/lib/util";
import SummaryCard from "./SummaryCard";

type ExerciseSummaryProps = {
  exercises: Exercise[];
};

type SummaryStats = {
  count: number; // number of exercises
  totalDistance: number;
  maxDistance: number;
  totalDuration: number;
  maxDuration: number;
};

// has a summary stat object for all exercises combined, and a summary stat object for each exercise type
type CompleteSummary = SummaryStats & {
  byType: Record<string, SummaryStats>;
};

const createEmptySummaryStats = (): SummaryStats => ({
  count: 0,
  totalDistance: 0,
  maxDistance: 0,
  totalDuration: 0,
  maxDuration: 0,
});

const calculateSummaryStats = (exercises: Exercise[]): CompleteSummary => {
  // init complete summary object
  const stats: CompleteSummary = {
    ...createEmptySummaryStats(),
    byType: {},
  };

  exercises.forEach((exercise) => {
    const exerciseType = capitalize(exercise.type ?? "unknown"); // capitalize so that even the old database entries are counted
    const distance = exercise.distance ?? 0;
    const duration = exercise.duration ?? 0;

    // create and init summary stats for exercise type
    if (!stats.byType[exerciseType]) {
      stats.byType[exerciseType] = createEmptySummaryStats();
    }

    // update total stats
    stats.count++;
    stats.totalDistance += distance;
    stats.maxDistance = Math.max(stats.maxDistance, distance);
    stats.totalDuration += duration;
    stats.maxDuration = Math.max(stats.maxDuration, duration);

    // update stats for exercise type
    const typeStats = stats.byType[exerciseType];
    typeStats.count++;
    typeStats.totalDistance += distance;
    typeStats.maxDistance = Math.max(typeStats.maxDistance, distance);
    typeStats.totalDuration += duration;
    typeStats.maxDuration = Math.max(typeStats.maxDuration, duration);
  });

  return stats;
};

// Formats a given time in seconds into a readable string (e.g. '3h 34m 45s')
const formatTimeForSummary = (seconds: number): string => {
  const roundedSeconds = Math.round(seconds);

  const hrs = Math.floor(roundedSeconds / 3600);
  const mins = Math.floor((roundedSeconds % 3600) / 60);
  const secs = roundedSeconds % 60;

  const hourString = hrs > 0 ? `${hrs}h` : null;
  const minString = mins > 0 ? `${mins}m` : null;
  const secString = secs > 0 ? `${secs}s` : null;

  const result = [hourString, minString, secString].filter(Boolean).join(" ");

  return result || "0s";
};

const Summary = ({ exercises }: ExerciseSummaryProps) => {
  const stats = calculateSummaryStats(exercises);

  const summaryCards = [
    {
      title: "Exercise Count: ",
      unit: "",
      total: stats.count.toString(),
      walk: stats.byType.Walking?.count.toString() ?? "0",
      run: stats.byType.Running?.count.toString() ?? "0",
      cycle: stats.byType.Cycling?.count.toString() ?? "0",
    },
    {
      title: "Total Distance: ",
      unit: "km",
      total: stats.totalDistance.toFixed(2),
      walk: stats.byType.Walking?.totalDistance.toFixed(2) ?? "0",
      run: stats.byType.Running?.totalDistance.toFixed(2) ?? "0",
      cycle: stats.byType.Cycling?.totalDistance.toFixed(2) ?? "0",
    },
    {
      title: "Max Distance: ",
      unit: "km",
      total: stats.maxDistance.toFixed(2),
      walk: stats.byType.Walking?.maxDistance.toFixed(2) ?? "0",
      run: stats.byType.Running?.maxDistance.toFixed(2) ?? "0",
      cycle: stats.byType.Cycling?.maxDistance.toFixed(2) ?? "0",
    },
    {
      title: "Total Duration: ",
      unit: "",
      total: formatTimeForSummary(stats.totalDuration),
      walk: formatTimeForSummary(stats.byType.Walking?.totalDuration ?? 0),
      run: formatTimeForSummary(stats.byType.Running?.totalDuration ?? 0),
      cycle: formatTimeForSummary(stats.byType.Cycling?.totalDuration ?? 0),
    },
    {
      title: "Max Duration: ",
      unit: "",
      total: formatTimeForSummary(stats.maxDuration),
      walk: formatTimeForSummary(stats.byType.Walking?.maxDuration ?? 0),
      run: formatTimeForSummary(stats.byType.Running?.maxDuration ?? 0),
      cycle: formatTimeForSummary(stats.byType.Cycling?.maxDuration ?? 0),
    },
  ];

  return (
    <View style={styles.container}>
      {summaryCards.map((cardProps, index) => (
        <SummaryCard key={index} {...cardProps} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
  },
});

export default Summary;
