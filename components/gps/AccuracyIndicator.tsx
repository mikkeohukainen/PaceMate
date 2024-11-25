import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { GPS_TRACKING_THRESHOLD } from "@/hooks/useLocationTracking";

interface AccuracyStatus {
  status: string;
  statusMessage: string;
}

// accuracy thresholds in meters
// used to categorize the GPS signal quality for visual indicators and status messages
const GPS_ACCURACY_THRESHOLDS = {
  UNAVAILABLE: -1, // this is used if no accuracy available yet
  EXCELLENT: 5,
  GOOD: 10,
  MODERATE: 15,
  POOR: 30,
} as const;

const ACCURACY_COLORS: Record<string, string> = {
  excellent: "limegreen",
  good: "lightgreen",
  moderate: "orange",
  poor: "red",
  unusable: "darkred", // some better name for this? terrible? really poor?
  unavailable: "gray",
};

interface Props {
  accuracy: number;
}

const GpsAccuracyIndicator: React.FC<Props> = ({ accuracy }) => {
  const determineAccuracyStatus = (accuracy: number): AccuracyStatus => {
    const isAccuracyTooLow = accuracy > GPS_TRACKING_THRESHOLD;
    const statusMessage = isAccuracyTooLow
      ? "Accuracy too low for tracking"
      : "";

    if (accuracy === GPS_ACCURACY_THRESHOLDS.UNAVAILABLE) {
      return {
        status: "unavailable",
        statusMessage: "Connecting to GPS...",
      };
    }
    if (accuracy <= GPS_ACCURACY_THRESHOLDS.EXCELLENT) {
      return { status: "excellent", statusMessage };
    }
    if (accuracy <= GPS_ACCURACY_THRESHOLDS.GOOD) {
      return { status: "good", statusMessage };
    }
    if (accuracy <= GPS_ACCURACY_THRESHOLDS.MODERATE) {
      return { status: "moderate", statusMessage };
    }
    if (accuracy <= GPS_ACCURACY_THRESHOLDS.POOR) {
      return {
        status: "poor",
        statusMessage,
      };
    }
    return {
      status: "unusable",
      statusMessage,
    };
  };

  const { status, statusMessage } = determineAccuracyStatus(accuracy);

  // styles determined here because i couldn't get the color to work otherwise
  const styles = StyleSheet.create({
    indicator: {
      backgroundColor: ACCURACY_COLORS[status],
      borderRadius: 5,
      height: 10,
      marginRight: 8,
      width: 10,
    },
    row: {
      alignItems: "center",
      flexDirection: "row",
    },
    statusText: {
      fontWeight: "500",
    },
    warningText: {
      color: accuracy > GPS_TRACKING_THRESHOLD ? "red" : "gray",
      fontSize: 14,
    },
  });

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.indicator} />
        <Text style={styles.statusText}>
          {"GPS Accuracy: "}
          {status}
          {status !== "unavailable" && ` (±${Math.round(accuracy)}m)`}
        </Text>
      </View>
      {statusMessage && <Text style={styles.warningText}>{statusMessage}</Text>}
    </View>
  );
};

export default GpsAccuracyIndicator;
