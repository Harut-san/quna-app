import Button from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toggle from "../../components/Toggle";
import { APP_VERSION } from "../../constants/AppInfo";
import { supabase } from "../../constants/supabase";
import { useLanguage } from "../../contexts/LanguageContext";

type QuoteSource = "master" | "user" | "both";

const QUOTE_SOURCE_KEY = "quoteSourcePreference";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [quoteSourcePreference, setQuoteSourcePreference] =
    useState<QuoteSource>("both");
  const { language, setLanguage, translate } = useLanguage();

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedNotificationsState = await AsyncStorage.getItem(
          "isNotificationsEnabled"
        );
        if (savedNotificationsState !== null) {
          setIsNotificationsEnabled(JSON.parse(savedNotificationsState));
        }

        const savedQuoteSource = await AsyncStorage.getItem(QUOTE_SOURCE_KEY);
        if (savedQuoteSource !== null) {
          setQuoteSourcePreference(savedQuoteSource as QuoteSource);
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

  const handleQuoteSourceToggle = async (
    source: "master" | "user",
    value: boolean
  ) => {
    let newPreference: QuoteSource = quoteSourcePreference;

    if (source === "master") {
      if (value) {
        newPreference =
          quoteSourcePreference === "user" || quoteSourcePreference === "both"
            ? "both"
            : "master";
      } else {
        if (quoteSourcePreference === "both") {
          newPreference = "user";
        } else if (quoteSourcePreference === "master") {
          // Prevent disabling both, if master is the only one enabled, enable user
          newPreference = "user";
        }
      }
    } else if (source === "user") {
      if (value) {
        newPreference =
          quoteSourcePreference === "master" || quoteSourcePreference === "both"
            ? "both"
            : "user";
      } else {
        if (quoteSourcePreference === "both") {
          newPreference = "master";
        } else if (quoteSourcePreference === "user") {
          // Prevent disabling both, if user is the only one enabled, enable master
          newPreference = "master";
        }
      }
    }

    setQuoteSourcePreference(newPreference);
    try {
      await AsyncStorage.setItem(QUOTE_SOURCE_KEY, newPreference);
    } catch (e) {
      console.error("Failed to save quote source preference", e);
    }
  };

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      alert("Error signing out: " + error.message);
    }
  }

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
        label={translate("language")}
        isOn={language === "pl"}
        onToggle={(value) => setLanguage(value ? "pl" : "en")}
        onLabel={translate("polish")}
        offLabel={translate("english")}
      />

      <Text style={styles.sectionTitle}>{translate("Quote sources")}</Text>
      <Toggle
        label={translate("showMyQuotes")}
        isOn={
          quoteSourcePreference === "user" || quoteSourcePreference === "both"
        }
        onToggle={(value) => handleQuoteSourceToggle("user", value)}
        onLabel={translate("on")}
        offLabel={translate("off")}
      />
      <Toggle
        label={translate("showMasterQuotes")}
        isOn={
          quoteSourcePreference === "master" || quoteSourcePreference === "both"
        }
        onToggle={(value) => handleQuoteSourceToggle("master", value)}
        onLabel={translate("on")}
        offLabel={translate("off")}
      />

      <View style={styles.settingsButton}>
        <Button
          label={translate("appVersion")}
          theme="primary"
          onPress={() =>
            alert(
              `Quna v${APP_VERSION}\n© 2025 Quna Inc.\n author: Harut Vardikyan`
            )
          }
        />
      </View>
      <View style={styles.addQuoteButtonContainer}>
        <Link href="/AddQuoteScreen" asChild>
          <Button label="Add My Quote" theme="primary" />
        </Link>
      </View>
      <View style={styles.addQuoteButtonContainer}>
        {" "}
        {/* Reusing container style */}
        <Link href="/MyQuotesScreen" asChild>
          <Button label="My Quotes" theme="primary" />
        </Link>
      </View>

      <View style={styles.logoutButtonContainer}>
        <Button label="Log Out" theme="secondary" onPress={handleSignOut} />
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
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  settingsButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addQuoteButtonContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
