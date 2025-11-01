import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import Quote from "../components/Quote";
import { prompts } from "../constants/Content";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";

export default function Mindfulness() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const { translate } = useLanguage();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate('mindfulnessPrompts') });
  }, [navigation, translate]);

  const [currentPrompt, setCurrentPrompt] = useState({
    quote: translate("mindfulnessIntro"),
    author: "",
  });
  const [history, setHistory] = useState<{ quote: string; author: string }[]>(
    []
  );

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowPrompt = () => {
    setHistory([...history, currentPrompt]);
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const selectedPromptKey = prompts[randomIndex];
    setCurrentPrompt({ quote: translate(selectedPromptKey), author: "" });
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
      <Quote
        quote={currentPrompt.quote}
        textStyle={styles.text}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
      />
      {currentPrompt.author ? (
        <Text style={styles.author}>{currentPrompt.author}</Text>
      ) : null}
      <View style={styles.buttonContainerSticky}>
        <Button
          label={translate("previous")}
          onPress={handlePreviousPrompt}
          theme={history.length === 0 ? "disabled" : "secondary"}
        />

        <Button
          label={translate("gimmeMindfulness")}
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
