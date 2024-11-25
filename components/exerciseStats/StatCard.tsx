import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

export interface StatCardProps {
  label: string;
  value: string | number;
  unit: string;
}

const StatCard = ({ label, value, unit }: StatCardProps) => {
  return (
    <Card style={styles.statCard}>
      <Card.Content>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          {unit && <Text style={styles.unit}> {unit}</Text>}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  statCard: {
    width: "45%",
  },
  unit: {
    fontSize: 16,
  },
  value: {
    color: "green",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default StatCard;
