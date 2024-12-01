import { useMemo, memo, useState } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { Exercise } from "@/lib/exercise";
import { LocationPoint } from "@/lib/route";
import haversine from "haversine";

type ChartKind = "speed-over-time" | "distance-over-time";

const OPTIONS: { label: string; value: ChartKind }[] = [
  { label: "Distance over time", value: "distance-over-time" },
  { label: "Speed over time", value: "speed-over-time" },
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
  const [chartKind, setChartKind] = useState<ChartKind>("distance-over-time");
  const windowHeight = Dimensions.get("window").height;

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
      const startTime = new Date(exercise.start_time).getTime();
      const data = points.map((point, index) => {
        if (index === 0) return { value: 0 };

        const distance = calculateDistance(points[index - 1], point);
        const timeDiff = new Date(point.timestamp).getTime() - startTime;
        const speed = (distance / (timeDiff / 1000)) * 3600;

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
