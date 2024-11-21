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
import {
  loadUserProfile,
  saveUserProfile,
  deleteUserProfile,
} from "@/hooks/useUserProfile";
import { UserProfileType } from "@/types/interfaceTypes";
import { useRouter } from "expo-router";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<keyof UserProfileType | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>("");
  const router = useRouter();

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

  const handleResetData = async () => {
    const resetProfile: UserProfileType = {
      Age: 0,
      Weight: 0,
      Height: 0,
    };
    await saveUserProfile(resetProfile);
    router.back();
  };

  if (!userProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => openModal("Age")}
          >
            <Text style={styles.text}>Age</Text>
            {userProfile.Age === 0 ? (
              <Text style={styles.text}>not set</Text>
            ) : (
              <Text style={styles.text}>{userProfile.Age}</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => openModal("Height")}
          >
            <Text style={styles.text}>Height</Text>
            {userProfile.Height === 0 ? (
              <Text style={styles.text}>not set</Text>
            ) : (
              <Text style={styles.text}>{userProfile.Height}</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => openModal("Weight")}
          >
            <Text style={styles.text}>Weight</Text>
            {userProfile.Weight === 0 ? (
              <Text style={styles.text}>not set</Text>
            ) : (
              <Text style={styles.text}>{userProfile.Weight}</Text>
            )}
          </TouchableOpacity>
        </View>
        <Button title="reset all" onPress={() => handleResetData()} />
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
              placeholder=""
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
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // paddingTop: 12,
  },
  rowContainer: {
    width: "100%",
    alignItems: "center",
    // marginBottom: 8,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 30,
    // backgroundColor: "#eee",
    width: "100%",
  },
  text: {
    fontSize: 20,
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
