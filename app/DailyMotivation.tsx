import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import Quote from "../components/Quote";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import useMotivation from "../hooks/useMotivation";
import useFavorites from "../hooks/useFavorites";

interface MotivationItem {
  id: string;
  author: string;
  content: string;
}

export default function DailyMotivation() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const { translate, language } = useLanguage();
  const navigation = useNavigation();
  const { motivationData, loading, error } = useMotivation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [currentMotivation, setCurrentMotivation] = useState<MotivationItem>({
    id: "",
    author: "",
    content: translate("dailyMotivationIntro"),
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate('dailyMotivation') });
  }, [navigation, translate]);

  useEffect(() => {
    if (!loading && !error && motivationData.length > 0) {
      setCurrentIndex(0);
      setCurrentMotivation(motivationData[0]);
    }
  }, [motivationData, loading, error]);

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

  const handleShowMotivation = () => {
    if (motivationData.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % motivationData.length;
    setCurrentIndex(nextIndex);
    setCurrentMotivation(motivationData[nextIndex]);
  };

  const handlePreviousMotivation = () => {
    if (motivationData.length === 0) return;

    const prevIndex = (currentIndex - 1 + motivationData.length) % motivationData.length;
    setCurrentIndex(prevIndex);
    setCurrentMotivation(motivationData[prevIndex]);
  };

  const handleToggleFavorite = async () => {
    if (!currentMotivation.id) return;

    const isCurrentlyFavorite = isFavorite(currentMotivation.id);
    if (isCurrentlyFavorite) {
      const favoriteItem = favorites.find(fav => fav.id === currentMotivation.id);
      if (favoriteItem) {
        await removeFavorite(favoriteItem.favoriteId);
      }
    } else {
      const quoteType = currentMotivation.id.length === 36 ? 'user' : 'master';
      await addFavorite(currentMotivation, quoteType);
    }
  };

  const displayQuote = currentMotivation.content;

  return (
    <LinearGradient colors={["#101923", "#003a05ff"]} style={styles.container}>
      <Quote
        quote={displayQuote}
        author={currentMotivation.author}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        isFavorite={isFavorite(currentMotivation.id)}
        onToggleFavorite={handleToggleFavorite}
      />
      <View style={styles.buttonContainerSticky}>
        <Button
          label={translate("previous")}
          onPress={handlePreviousMotivation}
          theme={motivationData.length === 0 ? "disabled" : "secondary"}
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