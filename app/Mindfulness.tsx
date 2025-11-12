import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import Quote from "../components/Quote";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import useMindfulness from "../hooks/useMindfulness";
import useFavorites from "../hooks/useFavorites";

interface MindfulnessItem {
  id: string;
  author: string;
  content_en: string;
  content_pl: string;
  favorited_by: string[];
}

export default function Mindfulness() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const { translate } = useLanguage();
  const navigation = useNavigation();
  const { mindfulnessData, loading, error, refetchMindfulness } =
    useMindfulness();
  const { toggleFavorite, isFavorite, refetchFavorites } = useFavorites();

  const [currentPrompt, setCurrentPrompt] = useState<MindfulnessItem>({
    id: "",
    author: "",
    content_en: translate("mindfulnessIntro"),
    content_pl: translate("mindfulnessIntro"),
    favorited_by: [],
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate("mindfulnessPrompts") });
  }, [navigation, translate]);

  useEffect(() => {
    if (!loading && !error && mindfulnessData.length > 0) {
      setCurrentIndex(0);
      setCurrentPrompt(mindfulnessData[0]);
    }
  }, [mindfulnessData, loading, error]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const handleShowPrompt = () => {
    if (mindfulnessData.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % mindfulnessData.length;
    setCurrentIndex(nextIndex);
    setCurrentPrompt(mindfulnessData[nextIndex]);
  };

  const handlePreviousPrompt = () => {
    if (mindfulnessData.length === 0) return;

    const prevIndex =
      (currentIndex - 1 + mindfulnessData.length) % mindfulnessData.length;
    setCurrentIndex(prevIndex);
    setCurrentPrompt(mindfulnessData[prevIndex]);
  };

  const handleToggleFavorite = async () => {
    if (!currentPrompt.id) return;
    await toggleFavorite(currentPrompt.id);
  };

  return (
    <LinearGradient colors={["#101923", "#0048acff"]} style={styles.container}>
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        <Quote
          content_en={currentPrompt.content_en}
          content_pl={currentPrompt.content_pl}
          author={currentPrompt.author}
          gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
          isFavorite={isFavorite(currentPrompt.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>
      <View style={styles.buttonContainerSticky}>
        <Button
          label={translate("previous")}
          onPress={handlePreviousPrompt}
          theme={mindfulnessData.length === 0 ? "disabled" : "secondary"}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101923",
  },
  errorText: {
    color: "red",
    fontSize: 18,
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