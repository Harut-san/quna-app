import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import Quote from "../components/Quote";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import useWisdom from "../hooks/useWisdom";
import useFavorites from "../hooks/useFavorites";


interface WisdomItem {
  id: string;
  author: string;
  content: string;
  content_en: string | null;
  content_pl: string | null;
}

export default function Wisdom() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });
  const { translate, language } = useLanguage();
  const navigation = useNavigation();
  const { wisdomData, loading, error } = useWisdom();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [currentWisdom, setCurrentWisdom] = useState<WisdomItem>({
    id: "",
    author: "",
    content: translate("wisdomIntro"),
    content_en: translate("wisdomIntro"),
    content_pl: translate("wisdomIntro"),
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate('wisdom') });
  }, [navigation, translate]);

  useEffect(() => {
    if (!loading && !error && wisdomData.length > 0) {
      setCurrentIndex(0);
      setCurrentWisdom(wisdomData[0]);
    }
  }, [wisdomData, loading, error]);

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

  const handleShowWisdom = () => {
    if (wisdomData.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % wisdomData.length;
    setCurrentIndex(nextIndex);
    setCurrentWisdom(wisdomData[nextIndex]);
  };

  const handlePreviousWisdom = () => {
    if (wisdomData.length === 0) return;

    const prevIndex = (currentIndex - 1 + wisdomData.length) % wisdomData.length;
    setCurrentIndex(prevIndex);
    setCurrentWisdom(wisdomData[prevIndex]);
  };

  const handleToggleFavorite = async () => {
    if (!currentWisdom.id) return;

    const isCurrentlyFavorite = isFavorite(currentWisdom.id);
    if (isCurrentlyFavorite) {
      const favoriteItem = favorites.find(fav => fav.id === currentWisdom.id);
      if (favoriteItem) {
        await removeFavorite(favoriteItem.favoriteId);
      }
    } else {
      // Determine quoteType based on whether it's a user_content or master_quotes item
      // This is a simplification; a more robust solution might involve storing quoteType in wisdomData
      const quoteType = currentWisdom.id.length === 36 ? 'user' : 'master'; // Assuming UUIDs are user_content and shorter IDs are master_quotes
      await addFavorite(currentWisdom, quoteType);
    }
  };

  const displayQuote = currentWisdom.content;

  return (
    <LinearGradient colors={["#101923", "#3a0000"]} style={styles.container}>

      <Quote
        quote={displayQuote}
        author={currentWisdom.author}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        isFavorite={isFavorite(currentWisdom.id)}
        onToggleFavorite={handleToggleFavorite}
      />
      <View style={styles.buttonContainerSticky}>
        <Button
          colors={["#cfcfcf28", "#57575744"]}
          label={translate("previous")}
          onPress={handlePreviousWisdom}
          theme={wisdomData.length === 0 ? "disabled" : "secondary"}
        />

        <Button
          label={translate("showMeSomeWisdom")}
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




