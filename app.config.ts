import * as pkg from "./package.json";
import { ExpoConfig, ConfigContext } from "expo/config";

module.exports = function (_config: ConfigContext): ExpoConfig {
  return {
    name: "PaceMate",
    slug: "pace-mate",
    version: pkg.version,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pace-mate",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.github.pacemate",
    },
    android: {
      package: "com.github.pacemate",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.POST_NOTIFICATIONS",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.SCHEDULE_EXACT_ALARM",
      ],
    },
    plugins: ["expo-router", "expo-location"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "041d7f0d-fc49-48cc-ac0b-f43aec46d99c",
      },
    },
  };
};
