import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, RadioButton } from "react-native-paper";
import { setInactivityThreshold, getInactivityThreshold } from "@/lib/storage";

const NotificationSettings = () => {
  const [threshold, setThreshold] = useState<number>(1);

  useEffect(() => {
    const loadThreshold = async () => {
      const storedThreshold = await getInactivityThreshold();
      setThreshold(storedThreshold);
    };
    loadThreshold();
  }, []);

  const handleThresholdChange = async (value: string) => {
    const days = parseInt(value);
    setThreshold(days);
    try {
      await setInactivityThreshold(days);
    } catch (error) {
      console.error("Failed to set inactivity threshold:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inactivity Alert Threshold</Text>
      <RadioButton.Group
        onValueChange={handleThresholdChange}
        value={threshold.toString()}
      >
        <RadioButton.Item label="1 Day" value="1" />
        <RadioButton.Item label="2 Days" value="2" />
        <RadioButton.Item label="3 Days" value="3" />
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginVertical: 16,
  },
});

export default NotificationSettings;
