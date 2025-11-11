import { useState, useEffect, useCallback } from "react";
import { supabase } from "../constants/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";

interface MantraItem {
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

const useMantra = () => {
  const [mantraData, setMantraData] = useState<MantraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteSourcePreference, setQuoteSourcePreference] =
    useState<QuoteSource>("both");
  const { user } = useAuth();

  const fetchMantra = useCallback(async () => {
    setLoading(true);
    setError(null);
    let fetchedMantra: MantraItem[] = [];

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
          .eq("category", "Mantras");

        if (masterError) {
          throw masterError;
        }
        if (masterData) {
          fetchedMantra = [...fetchedMantra, ...masterData];
        }
      }

      if (
        (currentPreference === "user" || currentPreference === "both") &&
        user
      ) {
        const { data: userData, error: userError } = await supabase
          .from("quotes")
          .select("id, author, content_en, content_pl, favorited_by")
          .eq("category", "Mantras") // Filter by category 'Mantras'
          .eq("user_id", user.id)
          .eq("is_master", false);

        if (userError) {
          throw userError;
        }
        if (userData) {
          fetchedMantra = [...fetchedMantra, ...userData];
        }
      }

      // Shuffle the combined array
      setMantraData(shuffleArray(fetchedMantra));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMantra();
  }, [fetchMantra]);

  return { mantraData, loading, error, refetchMantra: fetchMantra };
};

export default useMantra;