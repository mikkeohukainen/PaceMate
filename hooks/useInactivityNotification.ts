import { useEffect } from "react";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import { getInactivityThreshold } from "@/lib/storage";
import { getLastExerciseTime } from "../database/exerciseService";

const NOTIFICATION_TASK_NAME = "notify-if-inactive";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(NOTIFICATION_TASK_NAME, async () => {
  try {
    console.log("Running background task");
    const lastExerciseTime = await getLastExerciseTime();
    console.log("Last exercise time:", lastExerciseTime);

    if (!lastExerciseTime) {
      console.log("Scheduling notification");
      // Send notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Inactivity Alert",
          body: "You haven't exercised in a while. Let's get moving!",
        },
        trigger: null,
      });
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const thresholdDays = await getInactivityThreshold();
    const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;

    const now = Date.now();
    const lastExerciseTimestamp = new Date(lastExerciseTime).getTime();
    const timeSinceLastExercise = now - lastExerciseTimestamp;

    // const testThreshold = 60 * 1000; // 1 minute for testing

    if (timeSinceLastExercise >= thresholdMs) {
      console.log("Scheduling notification");
      // Send notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Inactivity Alert",
          body: "You haven't exercised in a while. Let's get moving!",
        },
        trigger: null,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const useInactivityNotification = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status: notificationStatus } =
        await Notifications.getPermissionsAsync();
      if (notificationStatus !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    // Register the background task
    const registerTask = async () => {
      try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(
          NOTIFICATION_TASK_NAME
        );
        if (!isRegistered) {
          await BackgroundFetch.registerTaskAsync(NOTIFICATION_TASK_NAME, {
            minimumInterval: 60 * 60, // 1 hour
            stopOnTerminate: false,
            startOnBoot: true,
          });
          console.log("Background task registered");
        }
      } catch (error) {
        console.error("Error registering background task:", error);
      }
    };

    requestPermissions();
    registerTask();
  }, []);
};
