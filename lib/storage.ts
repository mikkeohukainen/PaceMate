import AsyncStorage from "@react-native-async-storage/async-storage";

const INACTIVITY_THRESHOLD_KEY = "@inactivity-threshold";

export const setInactivityThreshold = async (days: number) => {
  await AsyncStorage.setItem(INACTIVITY_THRESHOLD_KEY, days.toString());
};

export const getInactivityThreshold = async (): Promise<number> => {
  const value = await AsyncStorage.getItem(INACTIVITY_THRESHOLD_KEY);
  return value ? parseInt(value, 10) : 1;
};
