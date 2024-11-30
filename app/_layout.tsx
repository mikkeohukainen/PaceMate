import {
  DarkTheme as RNDarkTheme,
  DefaultTheme as RNDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { Stack } from "expo-router";
import { useColorScheme, View } from "react-native";
import { ExerciseProvider } from "@/context/ExerciseContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: { ...RNDefaultTheme },
    reactNavigationDark: { ...RNDarkTheme },
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme,
  });

  return (
    <PaperProvider
      theme={colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme}
    >
      <ThemeProvider
        value={
          // Workaround for https://github.com/callstack/react-native-paper/issues/4540
          colorScheme === "dark"
            ? { ...DarkTheme, fonts: RNDarkTheme.fonts }
            : { ...LightTheme, fonts: RNDefaultTheme.fonts }
        }
      >
        <ExerciseProvider>
          <View
            style={{
              flex: 1,
              backgroundColor:
                colorScheme === "dark"
                  ? DarkTheme.colors.background
                  : LightTheme.colors.background,
            }}
          >
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="settings"
                options={{ headerTitle: "Settings" }}
              />
              <Stack.Screen
                name="exerciseDetails/[id]"
                options={{ headerTitle: "Exercise details" }}
              />
              <Stack.Screen
                name="profile"
                options={{ headerTitle: "Profile" }}
              />
              <Stack.Screen
                name="exercises"
                options={{ headerTitle: "Exercise History" }}
              />
            </Stack>
          </View>
          <StatusBar style="auto" />
        </ExerciseProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
