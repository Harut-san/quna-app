import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { mantras } from "../constants/Content";

export default function Mantras() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const [currentMantra, setCurrentMantra] = useState("you are in Mantras!");
  const [history, setHistory] = useState<string[]>([]);

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowMantra = () => {
    setHistory([...history, currentMantra]);
    const randomIndex = Math.floor(Math.random() * mantras.length);
    setCurrentMantra(mantras[randomIndex]);
  };

  const handlePreviousMantra = () => {
    if (history.length > 0) {
      const lastMantra = history.pop();
      if (lastMantra) {
        setCurrentMantra(lastMantra);
      }
      setHistory([...history]);
    }
  };

  return (
    <LinearGradient colors={["#101923", "#6f0066ff"]} style={styles.container}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        style={styles.textBackgroundGradient}
      >
        <Text style={styles.text}>{currentMantra}</Text>
      </LinearGradient>
      <View style={styles.buttonContainerSticky}>
        <Button
          label="Previous"
          onPress={handlePreviousMantra}
          theme={history.length === 0 ? "disabled" : undefined}
        />

        <Button
          label="Gimme Mantra"
          theme="primary"
          onPress={handleShowMantra}
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
