import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { loadUserProfile, saveUserProfile } from "@/hooks/useUserProfile";
import { UserProfileType } from "@/types/interfaceTypes";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<keyof UserProfileType | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>("");

  // Get user profile data from device
  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await loadUserProfile();
      setUserProfile(profile);
    };

    fetchUserProfile();
  }, []);

  // Update userProfile by key/value and save it to device
  const handleProfileUpdate = async (
    key: keyof UserProfileType,
    value: number
  ) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, [key]: value };
      setUserProfile(updatedProfile);
      await saveUserProfile(updatedProfile);
    }
  };

  const openModal = (key: keyof UserProfileType) => {
    setSelectedKey(key);
    setInputValue(userProfile ? userProfile[key].toString() : "");
    setModalVisible(true);
  };

  const saveValue = () => {
    if (selectedKey !== null) {
      handleProfileUpdate(selectedKey, parseInt(inputValue, 10));
    }
    setModalVisible(false);
  };

  if (!userProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => openModal("Age")}>
          <Text style={styles.textContainer}>Age</Text>
          {userProfile.Age === 0 ? (
            <Text style={styles.textContainer}>not set</Text>
          ) : (
            <Text style={styles.textContainer}>{userProfile.Age}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => openModal("Height")}>
          <Text style={styles.textContainer}>Height</Text>
          {userProfile.Height === 0 ? (
            <Text style={styles.textContainer}>not set</Text>
          ) : (
            <Text style={styles.textContainer}>{userProfile.Height}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => openModal("Weight")}>
          <Text style={styles.textContainer}>Weight</Text>
          {userProfile.Weight === 0 ? (
            <Text style={styles.textContainer}>not set</Text>
          ) : (
            <Text style={styles.textContainer}>{userProfile.Weight}</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
            />
            <Button title="Save" onPress={saveValue} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
  },
  textContainer: {
    fontSize: 20,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
