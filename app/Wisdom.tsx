import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import Quote from "../components/Quote";
import { wisdom } from "../constants/Content";

export default function Wisdom() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const [currentWisdom, setCurrentWisdom] = useState({
    quote:
      "Tap into the well of timeless wisdom.\n Let these words guide your path.",
    author: "",
  });
  const [history, setHistory] = useState<{ quote: string; author: string }[]>(
    []
  );

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowWisdom = () => {
    setHistory([...history, currentWisdom]);
    const randomIndex = Math.floor(Math.random() * wisdom.length);
    setCurrentWisdom(wisdom[randomIndex]);
  };

  const handlePreviousWisdom = () => {
    if (history.length > 0) {
      const lastWisdom = history.pop();
      if (lastWisdom) {
        setCurrentWisdom(lastWisdom);
      }
      setHistory([...history]);
    }
  };

  return (
    <LinearGradient colors={["#101923", "#3a0000"]} style={styles.container}>
      <Quote
        quote={currentWisdom.quote}
        textStyle={styles.text}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
      />
      {currentWisdom.author ? (
        <Text style={styles.author}>{currentWisdom.author}</Text>
      ) : null}
      <View style={styles.buttonContainerSticky}>
        <Button
          colors={["#cfcfcf28", "#57575744"]}
          label="Previous"
          onPress={handlePreviousWisdom}
          theme={history.length === 0 ? "disabled" : "secondary"}
        />

        <Button
          label="Show me some wisdom"
          theme="primary"
          onPress={handleShowWisdom}
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
});
