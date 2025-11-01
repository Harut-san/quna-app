import Button from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toggle from "../../components/Toggle";
import { APP_VERSION } from "../../constants/AppInfo";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isPolish, setIsPolish] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedNotificationsState = await AsyncStorage.getItem(
          "isNotificationsEnabled"
        );
        if (savedNotificationsState !== null) {
          setIsNotificationsEnabled(JSON.parse(savedNotificationsState));
        }

        const savedLanguageState = await AsyncStorage.getItem("isPolish");
        if (savedLanguageState !== null) {
          setIsPolish(JSON.parse(savedLanguageState));
        }
      } catch (e) {
        console.error("Failed to load the state from storage", e);
      }
    };

    loadState();
  }, []);

  const handleNotificationsToggle = async (value: boolean) => {
    setIsNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem(
        "isNotificationsEnabled",
        JSON.stringify(value)
      );
    } catch (e) {
      console.error("Failed to save the state to storage", e);
    }
  };

  const handleLanguageToggle = async (value: boolean) => {
    setIsPolish(value);
    try {
      await AsyncStorage.setItem("isPolish", JSON.stringify(value));
    } catch (e) {
      console.error("Failed to save the state to storage", e);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Settings screen</Text> */}
      <Toggle
        label="Notifications"
        isOn={isNotificationsEnabled}
        onToggle={handleNotificationsToggle}
        onLabel="On"
        offLabel="Off"
      />
      <Toggle
        label="Language"
        isOn={isPolish}
        onToggle={handleLanguageToggle}
        onLabel="Polish"
        offLabel="English"
      />
      <View style={styles.settingsButton}>
        <Button
          label="App version"
          theme="primary"
          onPress={() =>
            alert(
              `Quna v${APP_VERSION}\n© 2025 Quna Inc.\n author: Harut Vardikyan`
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingTop: 10,
  },
  text: {
    color: "white",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
  },
  settingsButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
