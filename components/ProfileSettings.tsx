import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { loadUserProfile, saveUserProfile, UserProfile } from "@/lib/profile";

const ProfileSettings = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 0,
    height: 0,
    weight: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await loadUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (key: keyof UserProfile, value: string) => {
    const numericValue = parseInt(value, 10);
    const updatedProfile = { ...userProfile, [key]: numericValue || 0 };
    setUserProfile(updatedProfile);
  };

  const handleResetData = async () => {
    const resetProfile: UserProfile = {
      age: 0,
      weight: 0,
      height: 0,
    };
    await saveUserProfile(resetProfile);
    setUserProfile(resetProfile);
  };

  const handleSaveData = async () => {
    await saveUserProfile(userProfile);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <TextInput
        label="Age"
        value={userProfile.age ? userProfile.age.toString() : ""}
        onChangeText={(value) => handleInputChange("age", value)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Height (cm)"
        value={userProfile.height ? userProfile.height.toString() : ""}
        onChangeText={(value) => handleInputChange("height", value)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Weight (kg)"
        value={userProfile.weight ? userProfile.weight.toString() : ""}
        onChangeText={(value) => handleInputChange("weight", value)}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={handleSaveData}>
          Save Profile
        </Button>
        <Button mode="contained" onPress={handleResetData}>
          Reset Data
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    marginVertical: 16,
  },
});

export default ProfileSettings;
