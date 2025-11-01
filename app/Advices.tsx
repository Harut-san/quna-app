import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { advices } from "../constants/Content";

export default function Advices() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const [currentAdvice, setCurrentAdvice] = useState(advices[0]);
  const [history, setHistory] = useState<{ quote: string; author: string }[]>(
    []
  );

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowAdvice = () => {
    setHistory([...history, currentAdvice]);
    const randomIndex = Math.floor(Math.random() * advices.length);
    setCurrentAdvice(advices[randomIndex]);
  };

  const handlePreviousAdvice = () => {
    if (history.length > 0) {
      const lastAdvice = history.pop();
      if (lastAdvice) {
        setCurrentAdvice(lastAdvice);
      }
      setHistory([...history]);
    }
  };

  return (
    <LinearGradient colors={["#101923", "#3a0000"]} style={styles.container}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        style={styles.textBackgroundGradient}
      >
        <Text style={styles.text}>{currentAdvice.quote}</Text>
      </LinearGradient>
      <Text style={styles.author}>- {currentAdvice.author}</Text>
      <View style={styles.buttonContainerSticky}>
        <Button
          label="Previous"
          onPress={handlePreviousAdvice}
          theme={history.length === 0 ? "disabled" : undefined}
        />

        <Button
          label="Show me an Advice"
          theme="primary"
          onPress={handleShowAdvice}
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
