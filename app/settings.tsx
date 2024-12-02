import { StyleSheet, View } from "react-native";
import NotificationSettings from "@/components/NotificationSettings";
import ProfileSettings from "@/components/ProfileSettings";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ProfileSettings />
      <NotificationSettings />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
