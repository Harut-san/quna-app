import Quote from "@/components/Quote";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import useMantra from "../hooks/useMantra";
import useFavorites from "../hooks/useFavorites";
import { AntDesign } from "@expo/vector-icons";

interface MantraItem {
  id: string;
  author: string;
  content_en: string;
  content_pl: string;
  favorited_by: string[];
}

export default function Mantras() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
    ...AntDesign.font,
  });
  const { translate } = useLanguage();
  const navigation = useNavigation();
  const { mantraData, loading, error, refetchMantra } = useMantra();
  const { toggleFavorite, isFavorite, refetchFavorites } = useFavorites();

  const [currentMantra, setCurrentMantra] = useState<MantraItem>({
    id: "",
    author: "",
    content_en: translate("mantraIntro"),
    content_pl: translate("mantraIntro"),
    favorited_by: [],
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate("mantras") });
  }, [navigation, translate]);

  useEffect(() => {
    if (!loading && !error && mantraData.length > 0) {
      setCurrentIndex(0);
      setCurrentMantra(mantraData[0]);
    }
  }, [mantraData, loading, error]);

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

  const handleShowMantra = () => {
    if (mantraData.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % mantraData.length;
    setCurrentIndex(nextIndex);
    setCurrentMantra(mantraData[nextIndex]);
  };

  const handlePreviousMantra = () => {
    if (mantraData.length === 0) return;

    const prevIndex =
      (currentIndex - 1 + mantraData.length) % mantraData.length;
    setCurrentIndex(prevIndex);
    setCurrentMantra(mantraData[prevIndex]);
  };

  const handleToggleFavorite = async () => {
    if (!currentMantra.id) return;
    await toggleFavorite(currentMantra.id);
  };

  return (
    <LinearGradient colors={["#101923", "#6f0066ff"]} style={styles.container}>
      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        <Quote
          content_en={currentMantra.content_en}
          content_pl={currentMantra.content_pl}
          author={currentMantra.author}
          gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
          isFavorite={isFavorite(currentMantra.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>
      <View style={styles.buttonContainerSticky}>
        <Button
          label={translate("previous")}
          onPress={handlePreviousMantra}
          theme={mantraData.length === 0 ? "disabled" : "secondary"}
        />

        <Button
          label={translate("manifestingNow")}
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
});