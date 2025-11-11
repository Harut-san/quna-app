import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../constants/supabase';
import { useAuth } from "../contexts/AuthContext";

export interface FavoriteItem {
  id: string;
  author: string | null;
  content_en: string | null;
  content_pl: string | null;
  favorited_by: string[];
}

const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('id, author, content_en, content_pl, favorited_by')
        .contains('favorited_by', [user.id]);

      if (error) {
        throw error;
      }

      if (data) {
        setFavorites(data as FavoriteItem[]);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (quoteId: string) => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }
    try {
      const { error } = await supabase.rpc('toggle_favorite', { quote_id_to_toggle: quoteId });

      if (error) {
        throw error;
      }
      // Refetch favorites to update the list
      await fetchFavorites();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const isFavorite = useCallback((quoteId: string) => {
    return favorites.some(fav => fav.id === quoteId);
  }, [favorites]);

  return { favorites, loading, error, toggleFavorite, isFavorite, refetchFavorites: fetchFavorites };
};

export default useFavorites;

