import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_PROFILE_KEY = "@userProfile";

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
}

// Check if device has user profile initialized, if not, then initialize it
const checkIfUserProfileInitialized = async (): Promise<void> => {
  try {
    const storedValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (storedValue === null) {
      const initializeValues: UserProfile = {
        age: 0,
        weight: 0,
        height: 0,
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

const saveUserProfile = async (dataToSave: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(dataToSave));
    console.log("Saved data to storage with value:", dataToSave);
  } catch (error) {
    console.error("Failed to save data:", error);
  }
};

const loadUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const storedValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
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
