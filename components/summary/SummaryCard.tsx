import { StyleSheet, View } from "react-native";
import { Text, Icon, Card } from "react-native-paper";

type SummaryCardProps = {
  title: string;
  unit: string;
  total: string;
  walk: string;
  run: string;
  cycle: string;
};

const SummaryCard = ({
  title,
  unit,
  total,
  walk,
  run,
  cycle,
}: SummaryCardProps) => {
  return (
    <Card style={styles.summaryCard}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {title}
          <Text style={styles.totalValue}>
            {total} {unit}
          </Text>
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.section}>
          <Icon source="walk" size={24} />
          <Text style={styles.value}>
            {walk} {unit}
          </Text>
        </View>

        <View style={styles.section}>
          <Icon source="run" size={24} />
          <Text style={styles.value}>
            {run} {unit}
          </Text>
        </View>

        <View style={styles.section}>
          <Icon source="bike" size={24} />
          <Text style={styles.value}>
            {cycle} {unit}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  section: {
    alignItems: "center",
  },
  summaryCard: {
    marginVertical: 4,
    padding: 4,
  },
  title: {
    fontSize: 18,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  totalValue: {
    color: "green",
    fontSize: 20,
  },
  value: {
    color: "green",
    fontSize: 16,
  },
});

export default SummaryCard;
