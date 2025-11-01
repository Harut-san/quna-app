import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { starters } from "../constants/Content";

export default function ConversationStarters() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const [currentStarter, setCurrentStarter] = useState(
    "you are in Conversation Starters!"
  );
  const [history, setHistory] = useState<string[]>([]);

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowStarter = () => {
    setHistory([...history, currentStarter]);
    const randomIndex = Math.floor(Math.random() * starters.length);
    setCurrentStarter(starters[randomIndex]);
  };

  const handlePreviousStarter = () => {
    if (history.length > 0) {
      const lastStarter = history.pop();
      if (lastStarter) {
        setCurrentStarter(lastStarter);
      }
      setHistory([...history]);
    }
  };

  return (
    <LinearGradient colors={["#101923", "#00565dff"]} style={styles.container}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        style={styles.textBackgroundGradient}
      >
        <Text style={styles.text}>{currentStarter}</Text>
      </LinearGradient>
      <View style={styles.buttonContainerSticky}>
        <Button
          label="Previous"
          onPress={handlePreviousStarter}
          theme={history.length === 0 ? "disabled" : undefined}
        />

        <Button
          label="Gimme Starter"
          theme="primary"
          onPress={handleShowStarter}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100, // Add padding to prevent content from being hidden by the sticky button
  },
  textBackgroundGradient: {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "TimesNewRoman",
    textAlign: "center",
    color: "white",
    fontSize: 32,
    fontStyle: "italic",
  },
  buttonContainerSticky: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: "center",
  },
  link: {
    fontSize: 24,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
