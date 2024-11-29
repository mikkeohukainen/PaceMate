import { StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import NotificationSettings from "@/components/NotificationSettings";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <>
      <View style={styles.textArea}>
        <Text style={styles.profile} onPress={() => router.push("/profile")}>
          Profile
        </Text>
      </View>
      <NotificationSettings />
    </>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: "#eee",
    fontSize: 20,
    padding: 16,
    textAlign: "left",
    width: "100%",
    // borderWidth: 1,
  },
  textArea: {
    // flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
