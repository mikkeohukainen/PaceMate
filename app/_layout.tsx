import {
  DarkTheme as RNDarkTheme,
  DefaultTheme as RNDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { Stack } from "expo-router";
import { useColorScheme, View } from "react-native";
import { ExerciseProvider } from "@/context/ExerciseContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: RNDefaultTheme,
    reactNavigationDark: RNDarkTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme,
  });

  return (
    <RootSiblingParent>
      <PaperProvider
        theme={colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme}
      >
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
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
                  name="userProfile"
                  options={{ headerTitle: "User profile" }}
                />
              </Stack>
            </View>
          </ExerciseProvider>
        </ThemeProvider>
      </PaperProvider>
    </RootSiblingParent>
  );
}
