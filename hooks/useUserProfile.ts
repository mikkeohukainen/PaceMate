import AsyncStogate from "@react-native-async-storage/async-storage";
import { UserProfileType } from "@/types/interfaceTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_PROFILE_KEY = "@userProfile";

// Check if device has user profile initialized, if not, then initialize it
const checkIfUserProfileInitialized = async (): Promise<void> => {
  try {
    const storedValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (storedValue === null) {
      const initializeValues: UserProfileType = {
        Age: 0,
        Weight: 0,
        Height: 0,
      };
      await AsyncStorage.setItem(
        USER_PROFILE_KEY,
        JSON.stringify(initializeValues)
      );
      console.log("Initialized storage with key:", USER_PROFILE_KEY);
      console.log("Initialized storage with value:", initializeValues);
    }
  } catch (error) {
    console.error("Failed to initialize storage:", error);
  }
};

// herpderp validation of data
const validateUserProfile = (data: UserProfileType): boolean => {
  return (
    typeof data.Age === "number" &&
    typeof data.Weight === "number" &&
    typeof data.Height === "number"
  );
};

const saveUserProfile = async (dataToSave: UserProfileType): Promise<void> => {
  if (validateUserProfile(dataToSave)) {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(dataToSave));
      console.log("Saved data to storage with value:", dataToSave);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  } else {
    console.error("Invalid data to save:", dataToSave);
  }
};

const loadUserProfile = async (): Promise<UserProfileType | null> => {
  try {
    const storedValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    // console.log("Loaded data from storage with value:", storedValue);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error("Failed to load data:", error);
    return null;
  }
};

// For testing purposes
const deleteUserProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    console.log("Deleted user profile from storage");
  } catch (error) {
    console.error("Failed to delete user profile:", error);
  }
};

export {
  checkIfUserProfileInitialized,
  saveUserProfile,
  loadUserProfile,
  deleteUserProfile,
};
