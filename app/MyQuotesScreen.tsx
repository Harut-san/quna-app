import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CollapsibleSection from "../components/CollapsibleSection";
import QuoteComponent from "../components/Quote"; // Renamed to avoid conflict with interface
import { supabase } from "../constants/supabase";
import useFavorites, { FavoriteItem } from "../hooks/useFavorites";

import { useLanguage } from "../contexts/LanguageContext";

interface QuoteItem {
  id: string;
  content_en: string | null;
  content_pl: string | null;
  author: string | null;
  category: string;
  user_id: string;
}

export default function MyQuotesScreen() {
  const [addedQuotes, setAddedQuotes] = useState<QuoteItem[]>([]);
  const [loadingAddedQuotes, setLoadingAddedQuotes] = useState(true);
  const { language } = useLanguage();

  const {
    favorites,
    loading: loadingFavorites,
    error: favoritesError,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useFavorites();

  useEffect(() => {
    fetchAddedQuotes();
  }, [favorites]); // Re-fetch added quotes when favorites change to ensure correct filtering

  async function fetchAddedQuotes() {
    setLoadingAddedQuotes(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "You must be logged in to view your quotes.");
      setLoadingAddedQuotes(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_content")
      .select("id, content_en, content_pl, author, category, user_id")
      .eq("user_id", user.id);

    if (error) {
      Alert.alert("Error fetching added quotes", error.message);
      console.error("Error fetching added quotes:", error);
    } else {
      // Filter out quotes that are already in favorites
      const nonFavoriteAddedQuotes = (data || []).filter(
        (quote: QuoteItem) => !isFavorite(quote.id)
      );
      setAddedQuotes(nonFavoriteAddedQuotes);
    }
    setLoadingAddedQuotes(false);
  }

  const handleDeleteQuote = async (quoteId: string) => {
    Alert.alert("Delete Quote", "Are you sure you want to delete this quote?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("user_content")
            .delete()
            .eq("id", quoteId);

          if (error) {
            Alert.alert("Error deleting quote", error.message);
          } else {
            fetchAddedQuotes();
          }
        },
      },
    ]);
  };

  const handleToggleFavorite = async (
    quote: QuoteItem,
    quoteType: "master" | "user"
  ) => {
    const isCurrentlyFavorite = isFavorite(quote.id);
    if (isCurrentlyFavorite) {
      const favoriteItem = favorites.find((fav) => fav.id === quote.id);
      if (favoriteItem) {
        await removeFavorite(favoriteItem.favoriteId);
      }
    } else {
      await addFavorite(quote, quoteType);
    }
  };

  const handleUnfavorite = async (favoriteId: string) => {
    await removeFavorite(favoriteId);
  };

  const renderQuoteItem = ({ item }: { item: QuoteItem }) => (
    <QuoteComponent
      quote={language === "pl" ? item.content_pl : item.content_en}
      author={item.author}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item, "user")} // Assuming user_content quotes are 'user' type
      onDelete={() => handleDeleteQuote(item.id)}
    />
  );

  const renderFavoriteQuoteItem = ({ item }: { item: FavoriteItem }) => (
    <QuoteComponent
      quote={language === 'pl' ? item.content_pl : item.content_en}
      author={item.author}
      isFavorite={true} // Always true for favorites screen
      onToggleFavorite={() => handleUnfavorite(item.favoriteId)}
    />
  );

  if (loadingAddedQuotes || loadingFavorites) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#077480" />
        <Text style={styles.loadingText}>Loading your quotes...</Text>
      </View>
    );
  }

  if (favoritesError) {
    Alert.alert("Error fetching favorites", favoritesError);
  }

  return (
    <View style={styles.container}>
      {/* Added Quotes Section */}
      <CollapsibleSection title={`Added Quotes (${addedQuotes.length})`}>
        {addedQuotes.length === 0 ? (
          <Text style={styles.noQuotesText}>
            You haven't added any quotes yet.
          </Text>
        ) : (
          <FlatList
            data={addedQuotes}
            keyExtractor={(item) => item.id}
            renderItem={renderQuoteItem}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </CollapsibleSection>

      {/* Favorite Quotes Section */}
      <CollapsibleSection title={`Favorite Quotes (${favorites.length})`}>
        {favorites.length === 0 ? (
          <Text style={styles.noQuotesText}>
            You haven't favorited any quotes yet.
          </Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteQuoteItem}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </CollapsibleSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101923",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101923",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#25292e",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  collapseIcon: {
    color: "white",
    fontSize: 16,
  },
  listContentContainer: {
    paddingBottom: 10,
    alignItems: "center",
  },
  quoteItem: {
    backgroundColor: "#25292e",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 5,
  },

  quoteAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#bdbdbd",
    textAlign: "right",
    marginBottom: 5,
  },
  quoteCategory: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  noQuotesText: {
    color: "#ccc",
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
});
