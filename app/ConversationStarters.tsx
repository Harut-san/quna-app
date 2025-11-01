import Quote from "@/components/Quote";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { starters } from "../constants/Content";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";

export default function ConversationStarters() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const { translate } = useLanguage();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate('conversationStarters') });
  }, [navigation, translate]);

  const [currentStarter, setCurrentStarter] = useState({
    quote: translate("conversationStarterIntro"),
    author: "",
  });
  const [history, setHistory] = useState<{ quote: string; author: string }[]>(
    []
  );

  if (!fontsLoaded) {
    // Optionally render a loading spinner
    return null;
  }

  const handleShowStarter = () => {
    setHistory([...history, currentStarter]);
    const randomIndex = Math.floor(Math.random() * starters.length);
    const selectedStarterKey = starters[randomIndex];
    setCurrentStarter({ quote: translate(selectedStarterKey), author: "" });
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
      <Quote
        quote={currentStarter.quote}
        textStyle={styles.text}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
      />
      {currentStarter.author ? (
        <Text style={styles.author}>{currentStarter.author}</Text>
      ) : null}
      <View style={styles.buttonContainerSticky}>
        <Button
          label={translate("previous")}
          onPress={handlePreviousStarter}
          theme={history.length === 0 ? "disabled" : "secondary"}
        />

        <Button
          label={translate("aLittlePush")}
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
