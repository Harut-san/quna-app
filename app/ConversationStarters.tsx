import Quote from "@/components/Quote";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import useConversationStarters from "../hooks/useConversationStarters";
import useFavorites from "../hooks/useFavorites";
import { AntDesign } from "@expo/vector-icons";

interface ConversationStarterItem {
  id: string;
  author: string;
  content: string;
}

export default function ConversationStarters() {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
    ...AntDesign.font,
  });
  const { translate, language } = useLanguage();
  const navigation = useNavigation();
  const { conversationStartersData, loading, error } = useConversationStarters();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [currentStarter, setCurrentStarter] = useState<ConversationStarterItem>({
    id: "",
    author: "",
    content: translate("conversationStarterIntro"),
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate('conversationStarters') });
  }, [navigation, translate]);

  useEffect(() => {
    if (!loading && !error && conversationStartersData.length > 0) {
      setCurrentIndex(0);
      setCurrentStarter(conversationStartersData[0]);
    }
  }, [conversationStartersData, loading, error]);

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

  const handleShowStarter = () => {
    if (conversationStartersData.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % conversationStartersData.length;
    setCurrentIndex(nextIndex);
    setCurrentStarter(conversationStartersData[nextIndex]);
  };

  const handlePreviousStarter = () => {
    if (conversationStartersData.length === 0) return;

    const prevIndex = (currentIndex - 1 + conversationStartersData.length) % conversationStartersData.length;
    setCurrentIndex(prevIndex);
    setCurrentStarter(conversationStartersData[prevIndex]);
  };

  const handleToggleFavorite = async () => {
    if (!currentStarter.id) return;

    const isCurrentlyFavorite = isFavorite(currentStarter.id);
    if (isCurrentlyFavorite) {
      const favoriteItem = favorites.find(fav => fav.id === currentStarter.id);
      if (favoriteItem) {
        await removeFavorite(favoriteItem.favoriteId);
      }
    } else {
      const quoteType = currentStarter.id.length === 36 ? 'user' : 'master';
      await addFavorite(currentStarter, quoteType);
    }
  };

  const displayQuote = currentStarter.content;

  return (
    <LinearGradient colors={["#101923", "#00565dff"]} style={styles.container}>
      <Quote
        quote={displayQuote}
        author={currentStarter.author}
        gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        isFavorite={isFavorite(currentStarter.id)}
        onToggleFavorite={handleToggleFavorite}
      />
      <View style={styles.buttonContainerSticky}>
        <Button
          label={translate("previous")}
          onPress={handlePreviousStarter}
          theme={conversationStartersData.length === 0 ? "disabled" : "secondary"}
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

  buttonContainerSticky: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: "center",
  },

});
