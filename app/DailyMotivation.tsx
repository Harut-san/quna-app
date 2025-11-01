import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { motivations } from "../constants/Content";

export default function DailyMotivation() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const [currentMotivation, setCurrentMotivation] = useState(motivations[0]);
  const [history, setHistory] = useState<{ quote: string; author: string }[]>(
    []
  );

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowMotivation = () => {
    setHistory([...history, currentMotivation]);
    const randomIndex = Math.floor(Math.random() * motivations.length);
    setCurrentMotivation(motivations[randomIndex]);
  };

  const handlePreviousMotivation = () => {
    if (history.length > 0) {
      const lastMotivation = history.pop();
      if (lastMotivation) {
        setCurrentMotivation(lastMotivation);
      }
      setHistory([...history]);
    }
  };

  return (
    <LinearGradient colors={["#101923", "#003a05ff"]} style={styles.container}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        style={styles.textBackgroundGradient}
      >
        <Text style={styles.text}>{currentMotivation.quote}</Text>
      </LinearGradient>
      <Text style={styles.author}>- {currentMotivation.author}</Text>
      <View style={styles.buttonContainerSticky}>
        <Button
          label="Previous"
          onPress={handlePreviousMotivation}
          theme={history.length === 0 ? "disabled" : undefined}
        />

        <Button
          label="Gimme Motivation"
          theme="primary"
          onPress={handleShowMotivation}
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
  author: {
    fontFamily: "TimesNewRoman",
    color: "white",
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: 20,
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
