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
  content: string;
}

export default function Mantras() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
    ...AntDesign.font,
  });
  const { translate, language } = useLanguage();
  const navigation = useNavigation();
  const { mantraData, loading, error } = useMantra();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [currentMantra, setCurrentMantra] = useState<MantraItem>({
    id: "",
    author: "",
        content: translate("mantraIntro"),
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate('mantras') });
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

    const prevIndex = (currentIndex - 1 + mantraData.length) % mantraData.length;
    setCurrentIndex(prevIndex);
    setCurrentMantra(mantraData[prevIndex]);
  };

  const handleToggleFavorite = async () => {
    if (!currentMantra.id) return;

    const isCurrentlyFavorite = isFavorite(currentMantra.id);
    if (isCurrentlyFavorite) {
      const favoriteItem = favorites.find(fav => fav.id === currentMantra.id);
      if (favoriteItem) {
        await removeFavorite(favoriteItem.favoriteId);
      }
    } else {
      const quoteType = currentMantra.id.length === 36 ? 'user' : 'master';
      await addFavorite(currentMantra, quoteType);
    }
  };

  const displayQuote = currentMantra.content;

  return (
    <LinearGradient colors={["#101923", "#6f0066ff"]} style={styles.container}>
      <Quote
        quote={displayQuote}
        textStyle={styles.text}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        isFavorite={isFavorite(currentMantra.id)}
        onToggleFavorite={handleToggleFavorite}
      />

      {currentMantra.author ? (
        <Text style={styles.author}>{currentMantra.author}</Text>
      ) : null}
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
