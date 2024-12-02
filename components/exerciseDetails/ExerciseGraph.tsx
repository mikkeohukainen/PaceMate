import { useMemo, memo, useState } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { Exercise } from "@/lib/exercise";
import { LocationPoint } from "@/lib/route";
import haversine from "haversine";

type ChartKind =
  | "speed-over-time"
  | "distance-over-time"
  | "speed-over-time-smoothed";

const OPTIONS: { label: string; value: ChartKind }[] = [
  { label: "Distance over time", value: "distance-over-time" },
  { label: "Speed over time", value: "speed-over-time" },
  { label: "Speed over time (smoothed)", value: "speed-over-time-smoothed" },
];

type ExerciseGraphProps = {
  exercise: Exercise;
  points: LocationPoint[];
};

const calculateDistance = (point1: LocationPoint, point2: LocationPoint) => {
  return haversine(
    {
      latitude: point1.latitude,
      longitude: point1.longitude,
    },
    {
      latitude: point2.latitude,
      longitude: point2.longitude,
    },
    { unit: "km" }
  );
};

function ExerciseGraph({ exercise, points }: ExerciseGraphProps) {
  const theme = useTheme();
  const [chartKind, setChartKind] = useState<ChartKind>(
    "speed-over-time-smoothed"
  );
  const windowHeight = Dimensions.get("window").height;

  const MOVING_AVERAGE_WINDOW_SIZE = 10;

  const chartData = useMemo(() => {
    if (!points || points.length === 0 || !exercise.start_time) return [];

    if (chartKind === "distance-over-time") {
      let totalDistance = 0;

      const data = points.map((point, index) => {
        if (index === 0) return { value: 0 };
        totalDistance += calculateDistance(points[index - 1], point);

        return {
          value: Math.round(totalDistance * 1000),
        };
      });
      return data;
    }

    if (chartKind === "speed-over-time") {
      const data = points.map((point, index) => {
        if (index === 0) return { value: 0 };

        const distance = calculateDistance(points[index - 1], point);
        const timeDiff =
          new Date(point.timestamp).getTime() -
          new Date(points[index - 1].timestamp).getTime();

        const speed = (distance / (timeDiff / 1000)) * 3600;

        return {
          value: speed,
        };
      });
      return data;
    }

    if (chartKind === "speed-over-time-smoothed") {
      const speeds: number[] = [];

      for (let i = 1; i < points.length; i++) {
        const distance = calculateDistance(points[i - 1], points[i]); // in km
        const timeDiff =
          (new Date(points[i].timestamp).getTime() -
            new Date(points[i - 1].timestamp).getTime()) /
          3600000; // Convert ms to hours

        // Avoid division by zero
        const speed = timeDiff > 0 ? distance / timeDiff : 0; // Speed in km/h
        speeds.push(speed);
      }

      // Apply moving average to the speeds
      const smoothedSpeeds = speeds.map((_, idx, arr) => {
        const start = Math.max(0, idx - MOVING_AVERAGE_WINDOW_SIZE + 1);
        const end = idx + 1;
        const windowSpeeds = arr.slice(start, end);
        const averageSpeed =
          windowSpeeds.reduce((sum, val) => sum + val, 0) / windowSpeeds.length;
        return averageSpeed;
      });

      // Build chart data
      const data = smoothedSpeeds.map((speed, index) => {
        if (index === 0) return { value: 0 };
        return {
          value: speed,
        };
      });

      return data;
    }

    return [];
  }, [exercise, points, chartKind]);

  return (
    <View style={{ flex: 1 }}>
      <Dropdown
        label="Graph type"
        options={OPTIONS}
        value={chartKind}
        onSelect={(value) => setChartKind(value as ChartKind)}
        hideMenuHeader
      />
      <LineChart
        data={chartData}
        yAxisLabelSuffix={chartKind === "distance-over-time" ? "m" : "km/h"}
        yAxisLabelWidth={50}
        height={windowHeight * 0.5}
        adjustToWidth
        curved
        hideDataPoints
        color={theme.colors.primary}
        xAxisColor={theme.colors.onBackground}
        yAxisColor={theme.colors.onBackground}
        yAxisTextStyle={{ color: theme.colors.onBackground }}
        xAxisLabelTextStyle={{ color: theme.colors.onBackground }}
        disableScroll
      />
    </View>
  );
}

export default memo(ExerciseGraph);
