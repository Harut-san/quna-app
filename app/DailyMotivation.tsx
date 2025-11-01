import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import Quote from "../components/Quote";
import { motivations } from "../constants/Content";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";

export default function DailyMotivation() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const { translate } = useLanguage();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate('dailyMotivation') });
  }, [navigation, translate]);

  const [currentMotivation, setCurrentMotivation] = useState({
    quote: translate("dailyMotivationIntro"),
    author: "",
  });
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
    const selectedMotivation = motivations[randomIndex];
    setCurrentMotivation({ quote: translate(selectedMotivation.key), author: selectedMotivation.author });
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
      <Quote
        quote={currentMotivation.quote}
        textStyle={styles.text}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
      />
      {currentMotivation.author ? (
        <Text style={styles.author}>{currentMotivation.author}</Text>
      ) : null}
      <View style={styles.buttonContainerSticky}>
        <Button
          label={translate("previous")}
          onPress={handlePreviousMotivation}
          theme={history.length === 0 ? "disabled" : "secondary"}
        />

        <Button
          label={translate("whyShouldIEven")}
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
