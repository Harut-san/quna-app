import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { useAuth } from "../contexts/AuthContext";

interface QuoteItem {
  id: string;
  content_en: string | null;
  content_pl: string | null;
  author: string | null;
  category: string;
  user_id: string;
}

export default function MyQuotesScreen() {
  const { user } = useAuth();
  const [allUserQuotes, setAllUserQuotes] = useState<QuoteItem[]>([]);
  const [loadingAddedQuotes, setLoadingAddedQuotes] = useState(true);

  const {
    favorites,
    loading: loadingFavorites,
    error: favoritesError,
    toggleFavorite,
    isFavorite,
    refetchFavorites,
  } = useFavorites();

  const fetchAddedQuotes = useCallback(async () => {
    if (!user) {
      setAllUserQuotes([]);
      setLoadingAddedQuotes(false);
      return;
    }
    setLoadingAddedQuotes(true);
    const { data, error } = await supabase
      .from("quotes")
      .select("id, content_en, content_pl, author, category, user_id")
      .eq("user_id", user.id)
      .eq("is_master", false);

    if (error) {
      Alert.alert("Error fetching added quotes", error.message);
      console.error("Error fetching added quotes:", error);
    } else {
      setAllUserQuotes(data || []);
    }
    setLoadingAddedQuotes(false);
  }, [user]);

  useEffect(() => {
    fetchAddedQuotes();
  }, [fetchAddedQuotes]);

  const nonFavoriteAddedQuotes = useMemo(() => {
    return allUserQuotes.filter((quote) => !isFavorite(quote.id));
  }, [allUserQuotes, isFavorite]);

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
            .from("quotes")
            .delete()
            .eq("id", quoteId);

          if (error) {
            Alert.alert("Error deleting quote", error.message);
          } else {
            fetchAddedQuotes();
            refetchFavorites();
          }
        },
      },
    ]);
  };

  const renderQuoteItem = ({ item }: { item: QuoteItem }) => (
    <QuoteComponent
      content_en={item.content_en}
      content_pl={item.content_pl}
      author={item.author}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
      onDelete={() => handleDeleteQuote(item.id)}
      gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
    />
  );

  const renderFavoriteQuoteItem = ({ item }: { item: FavoriteItem }) => (
    <QuoteComponent
      content_en={item.content_en}
      content_pl={item.content_pl}
      author={item.author}
      isFavorite={true} // Always true for favorites screen
      onToggleFavorite={() => toggleFavorite(item.id)}
      gradientColors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
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
      <CollapsibleSection title={`Added Quotes (${nonFavoriteAddedQuotes.length})`}>
        {nonFavoriteAddedQuotes.length === 0 ? (
          <Text style={styles.noQuotesText}>
            You haven&apos;t added any quotes yet.
          </Text>
        ) : (
          <FlatList
            data={nonFavoriteAddedQuotes}
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
            You haven&apos;t favorited any quotes yet.
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
    paddingHorizontal: 0,
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
