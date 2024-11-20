import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { SegmentedButtons, Switch } from "react-native-paper";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const [value, setValue] = useState("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const router = useRouter();

  return (
    <>
      <View style={styles.content}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "walk",
              label: "Walking",
            },
            {
              value: "train",
              label: "Transit",
            },
            { value: "drive", label: "Driving" },
          ]}
        />
        <Switch
          value={isSwitchOn}
          onValueChange={() => setIsSwitchOn(!isSwitchOn)}
        />
      </View>
      <View style={styles.textArea}>
        <Text
          style={styles.profile}
          onPress={() => router.push("/userProfile")}
        >
          Profile
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    // flex: 1,
    gap: 16,
    overflow: "hidden",
    padding: 32,
  },
  textArea: {
    // flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  profile: {
    width: "100%",
    textAlign: "left",
    padding: 16,
    borderWidth: 1,
  },
});
