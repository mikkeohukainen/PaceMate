import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setAppIsReady(true);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <Drawer>
            <Drawer.Screen
              name="(tabs)" // This is the name of the page and must match the url from root
              options={{
                drawerLabel: "Home",
                title: "Home",
              }}
            />
            <Drawer.Screen
              name="settings" // This is the name of the page and must match the url from root
              options={{
                drawerLabel: "Settings",
                title: "Settings",
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </PaperProvider>
  );
}
