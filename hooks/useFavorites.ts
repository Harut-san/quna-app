import { useState, useEffect } from 'react';
import { supabase } from '../constants/supabase';
import { useAuth } from "../contexts/AuthContext";

interface WisdomItem {
  id: string;
  author: string;
  content: string;
}

export interface FavoriteItem extends WisdomItem {
  favoriteId: string; // The ID of the favorite entry in the user_favorites table
  quoteType: 'master' | 'user';
}

const useFavorites = () => {
  const { user } = useAuth(); // Assuming useAuth provides the current user
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('id, quote_id, quote_author, quote_content, quote_type')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (data) {
          const mappedFavorites = data.map(item => ({
            id: item.quote_id, // Original quote ID
            favoriteId: item.id, // ID from user_favorites
            author: item.quote_author,
            content: item.quote_content,
            quoteType: item.quote_type,
          }));
          setFavorites(mappedFavorites);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();

    // Realtime listener for favorites (optional, but good for reactivity)
    const channel = supabase
    .channel('user_favorites_channel')
    .on(
      'postgres_changes',
      { event: '*' , schema: 'public', table: 'user_favorites', filter: `user_id=eq.${user.id}` },
      payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE' || payload.eventType === 'UPDATE') {
          // Re-fetch favorites to ensure we have the latest state
          fetchFavorites();
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

  }, [user]);

  const addFavorite = async (quote: WisdomItem, quoteType: 'master' | 'user') => {
    if (!user) {
      setError("User not authenticated.");
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          quote_id: quote.id,
          quote_content: quote.content,
          quote_author: quote.author,
          quote_type: quoteType,
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newFavorite: FavoriteItem = {
          id: data[0].quote_id,
          favoriteId: data[0].id,
          author: data[0].quote_author,
          content: data[0].quote_content,
          quoteType: data[0].quote_type,
        };
        setFavorites(prev => [...prev, newFavorite]);
        return newFavorite;
      }
    } catch (e: any) {
      setError(e.message);
    }
    return null;
  };

  const removeFavorite = async (favoriteId: string) => {
    if (!user) {
      setError("User not authenticated.");
      return false;
    }
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.id); // Ensure user can only delete their own favorites

      if (error) {
        throw error;
      }

      setFavorites(prev => prev.filter(fav => fav.favoriteId !== favoriteId));
      return true;
    } catch (e: any) {
      setError(e.message);
    }
    return false;
  };

  const isFavorite = (quoteId: string) => {
    return favorites.some(fav => fav.id === quoteId);
  };

  return { favorites, loading, error, addFavorite, removeFavorite, isFavorite };
};

export default useFavorites;
