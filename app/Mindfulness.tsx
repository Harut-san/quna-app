import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { prompts } from "../constants/Content";

export default function Mindfulness() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const [currentPrompt, setCurrentPrompt] = useState(
    "you are in Mindfulness Prompts!"
  );
  const [history, setHistory] = useState<string[]>([]);

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowPrompt = () => {
    setHistory([...history, currentPrompt]);
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  };

  const handlePreviousPrompt = () => {
    if (history.length > 0) {
      const lastPrompt = history.pop();
      if (lastPrompt) {
        setCurrentPrompt(lastPrompt);
      }
      setHistory([...history]);
    }
  };

  return (
    <LinearGradient colors={["#101923", "#0048acff"]} style={styles.container}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        style={styles.textBackgroundGradient}
      >
        <Text style={styles.text}>{currentPrompt}</Text>
      </LinearGradient>
      <View style={styles.buttonContainerSticky}>
        <Button
          label="Previous"
          onPress={handlePreviousPrompt}
          theme={history.length === 0 ? "disabled" : undefined}
        />

        <Button
          label="Gimme Mindfulness"
          theme="primary"
          onPress={handleShowPrompt}
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
