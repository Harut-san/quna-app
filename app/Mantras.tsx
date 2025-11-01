import Quote from "@/components/Quote";
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
  const [currentMantra, setCurrentMantra] = useState({
    quote:
      "Harness the power of your own voice. Repeat these words to center your mind and spirit.",
    author: "",
  });
  const [history, setHistory] = useState<{ quote: string; author: string }[]>(
    []
  );

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowMantra = () => {
    setHistory([...history, currentMantra]);
    const randomIndex = Math.floor(Math.random() * mantras.length);
    setCurrentMantra({ quote: mantras[randomIndex], author: "" });
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
      <Quote
        quote={currentMantra.quote}
        textStyle={styles.text}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
      />

      {currentMantra.author ? (
        <Text style={styles.author}>{currentMantra.author}</Text>
      ) : null}
      <View style={styles.buttonContainerSticky}>
        <Button
          label="Previous"
          onPress={handlePreviousMantra}
          theme={history.length === 0 ? "disabled" : "secondary"}
        />

        <Button
          label="Manifesting now 🧘‍♀️"
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
    borderRadius: 30,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#c5c5c533",
  },
  text: {
    fontFamily: "TimesNewRoman",
    textAlign: "center",
    color: "white",
    fontSize: 32,
    fontStyle: "italic",
    marginHorizontal: 5,
  },
  buttonContainerSticky: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: "center",
  },
});
