import { useState, useEffect, useCallback } from "react";
import { supabase } from "../constants/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";

interface ConversationStarterItem {
  id: string;
  author: string;
  content_en: string;
  content_pl: string;
  favorited_by: string[];
}

type QuoteSource = "master" | "user" | "both";

const QUOTE_SOURCE_KEY = "quoteSourcePreference"; // Reusing the same key for consistency

// Fisher-Yates (Knuth) shuffle algorithm
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const useConversationStarters = () => {
  const [conversationStartersData, setConversationStartersData] = useState<
    ConversationStarterItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteSourcePreference, setQuoteSourcePreference] =
    useState<QuoteSource>("both");
  const { user } = useAuth();

  const fetchConversationStarters = useCallback(async () => {
    setLoading(true);
    setError(null);
    let fetchedConversationStarters: ConversationStarterItem[] = [];

    // Load preference first
    let currentPreference: QuoteSource = "both"; // Default
    try {
      const savedQuoteSource = await AsyncStorage.getItem(QUOTE_SOURCE_KEY);
      if (savedQuoteSource !== null) {
        currentPreference = savedQuoteSource as QuoteSource;
      }
    } catch (e) {
      console.error("Failed to load quote source preference", e);
    }
    setQuoteSourcePreference(currentPreference);

    try {
      if (currentPreference === "master" || currentPreference === "both") {
        const { data: masterData, error: masterError } = await supabase
          .from("quotes")
          .select("id, author, content_en, content_pl, favorited_by")
          .eq("is_master", true)
          .eq("category", "Conversation Starters");

        if (masterError) {
          throw masterError;
        }
        if (masterData) {
          fetchedConversationStarters = [
            ...fetchedConversationStarters,
            ...masterData,
          ];
        }
      }

      if (
        (currentPreference === "user" || currentPreference === "both") &&
        user
      ) {
        const { data: userData, error: userError } = await supabase
          .from("quotes")
          .select("id, author, content_en, content_pl, favorited_by")
          .eq("category", "Conversation Starters") // Filter by category 'Conversation Starters'
          .eq("user_id", user.id)
          .eq("is_master", false);

        if (userError) {
          throw userError;
        }
        if (userData) {
          fetchedConversationStarters = [
            ...fetchedConversationStarters,
            ...userData,
          ];
        }
      }

      // Shuffle the combined array
      setConversationStartersData(shuffleArray(fetchedConversationStarters));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversationStarters();
  }, [fetchConversationStarters]);

  return {
    conversationStartersData,
    loading,
    error,
    refetchConversationStarters: fetchConversationStarters,
  };
};

export default useConversationStarters;
