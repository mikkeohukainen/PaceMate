import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Text, Button, TextInput } from "react-native-paper";
import { loadUserProfile, saveUserProfile, UserProfile } from "@/lib/profile";
import { useRouter } from "expo-router";

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<keyof UserProfile | null>(
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
  const handleProfileUpdate = async (key: keyof UserProfile, value: number) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, [key]: value };
      setUserProfile(updatedProfile);
      await saveUserProfile(updatedProfile);
    }
  };

  const openModal = (key: keyof UserProfile) => {
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
    const resetProfile: UserProfile = {
      age: 0,
      weight: 0,
      height: 0,
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
            onPress={() => openModal("age")}
          >
            <Text style={styles.text}>Age</Text>
            {userProfile.age === 0 ? (
              <Text style={styles.text}>not set</Text>
            ) : (
              <Text style={styles.text}>{userProfile.age}</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => openModal("height")}
          >
            <Text style={styles.text}>Height</Text>
            {userProfile.height === 0 ? (
              <Text style={styles.text}>not set</Text>
            ) : (
              <Text style={styles.text}>{userProfile.height}</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => openModal("weight")}
          >
            <Text style={styles.text}>Weight</Text>
            {userProfile.weight === 0 ? (
              <Text style={styles.text}>not set</Text>
            ) : (
              <Text style={styles.text}>{userProfile.weight}</Text>
            )}
          </TouchableOpacity>
        </View>
        <Button onPress={() => handleResetData()}>Reset all</Button>
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
            <Button onPress={saveValue}>Save</Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    // paddingTop: 12,
  },
  input: {
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  rowContainer: {
    alignItems: "center",
    width: "100%",
    // marginBottom: 8,
  },
  text: {
    fontSize: 20,
  },
  textContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 30,
    // backgroundColor: "#eee",
    width: "100%",
  },
});
