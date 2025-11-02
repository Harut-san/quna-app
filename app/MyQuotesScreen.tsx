import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../constants/supabase';
import Collapsible from 'react-native-collapsible';
import useFavorites from '../hooks/useFavorites';
import QuoteComponent from '../components/Quote'; // Renamed to avoid conflict with interface

interface QuoteItem {
  id: string;
  content: string;
  author: string | null;
  category: string;
  user_id: string;
}

export default function MyQuotesScreen() {
  const [addedQuotes, setAddedQuotes] = useState<QuoteItem[]>([]);
  const [loadingAddedQuotes, setLoadingAddedQuotes] = useState(true);
  const [isAddedCollapsed, setIsAddedCollapsed] = useState(false);
  const [isFavoritesCollapsed, setIsFavoritesCollapsed] = useState(false); // Favorites collapsed by default

  const { favorites, loading: loadingFavorites, error: favoritesError, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchAddedQuotes();
  }, [favorites]); // Re-fetch added quotes when favorites change to ensure correct filtering

  async function fetchAddedQuotes() {
    setLoadingAddedQuotes(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'You must be logged in to view your quotes.');
      setLoadingAddedQuotes(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_content')
      .select('id, content, author, category, user_id')
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Error fetching added quotes', error.message);
      console.error('Error fetching added quotes:', error);
    } else {
      // Filter out quotes that are already in favorites
      const nonFavoriteAddedQuotes = (data || []).filter(
        (quote: QuoteItem) => !isFavorite(quote.id)
      );
      setAddedQuotes(nonFavoriteAddedQuotes);
    }
    setLoadingAddedQuotes(false);
  }

  const handleToggleFavorite = async (quote: QuoteItem, quoteType: 'master' | 'user') => {
    const isCurrentlyFavorite = isFavorite(quote.id);
    if (isCurrentlyFavorite) {
      const favoriteItem = favorites.find(fav => fav.id === quote.id);
      if (favoriteItem) {
        await removeFavorite(favoriteItem.favoriteId);
      }
    } else {
      await addFavorite(quote, quoteType);
    }
  };

  const renderQuoteItem = ({ item }: { item: QuoteItem }) => (
    <QuoteComponent
      quote={item.content}
      textStyle={styles.quoteContent}
      author={item.author}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item, 'user')} // Assuming user_content quotes are 'user' type
    />
  );

  const renderFavoriteQuoteItem = ({ item }: { item: QuoteItem }) => (
    <QuoteComponent
      quote={item.content}
      textStyle={styles.quoteContent}
      author={item.author}
      isFavorite={true} // Always true for favorites screen
      onToggleFavorite={() => handleToggleFavorite(item, item.quoteType as 'master' | 'user')} // Use quoteType from favorite item
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
    Alert.alert('Error fetching favorites', favoritesError);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Quotes</Text>

      {/* Added Quotes Section */}
      <TouchableOpacity onPress={() => setIsAddedCollapsed(!isAddedCollapsed)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Added Quotes ({addedQuotes.length})</Text>
        <Text style={styles.collapseIcon}>{isAddedCollapsed ? '▼' : '▲'}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isAddedCollapsed}>
        {addedQuotes.length === 0 ? (
          <Text style={styles.noQuotesText}>You haven't added any quotes yet.</Text>
        ) : (
          <FlatList
            data={addedQuotes}
            keyExtractor={(item) => item.id}
            renderItem={renderQuoteItem}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </Collapsible>

      {/* Favorite Quotes Section */}
      <TouchableOpacity onPress={() => setIsFavoritesCollapsed(!isFavoritesCollapsed)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Favorite Quotes ({favorites.length})</Text>
        <Text style={styles.collapseIcon}>{isFavoritesCollapsed ? '▼' : '▲'}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isFavoritesCollapsed}>
        {favorites.length === 0 ? (
          <Text style={styles.noQuotesText}>You haven't favorited any quotes yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteQuoteItem}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101923',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101923',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#25292e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  collapseIcon: {
    color: 'white',
    fontSize: 16,
  },
  listContentContainer: {
    paddingBottom: 10,
  },
  quoteItem: {
    backgroundColor: '#25292e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  quoteContent: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#e0e0e0',
    marginBottom: 5,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#bdbdbd',
    textAlign: 'right',
    marginBottom: 5,
  },
  quoteCategory: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  noQuotesText: {
    color: '#ccc',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});
