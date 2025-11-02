import { useState, useEffect } from 'react';
import { supabase } from '../constants/supabase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../contexts/LanguageContext";

interface MantraItem {
  id: string;
  author: string;
  content_en: string;
  content_pl: string;
}

type QuoteSource = 'master' | 'user' | 'both';

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
  const [quoteSourcePreference, setQuoteSourcePreference] = useState<QuoteSource>('both');
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMantra = async () => {
      setLoading(true);
      setError(null);
      let fetchedMantra: MantraItem[] = [];

      // Load preference first
      let currentPreference: QuoteSource = 'both'; // Default
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
        if (currentPreference === 'master' || currentPreference === 'both') {
          const { data: masterData, error: masterError } = await supabase
            .from('master_quotes')
            .select('id, author, content_en, content_pl');

          if (masterError) {
            throw masterError;
          }
          if (masterData) {
            const mappedMasterData = masterData.map(item => ({
              id: item.id,
              author: item.author,
              content: language === 'pl' ? item.content_pl : item.content_en,
            }));
            fetchedMantra = [...fetchedMantra, ...mappedMasterData];
          }
        }

        if (currentPreference === 'user' || currentPreference === 'both') {
          const { data: userData, error: userError } = await supabase
            .from('user_content')
            .select('id, author, content_en, content_pl')
            .eq('category', 'Mantras'); // Filter by category 'Mantras'

          if (userError) {
            throw userError;
          }
          if (userData) {
            const mappedUserData = userData.map(item => ({
              id: item.id,
              author: item.author,
              content: language === 'pl' ? item.content_pl : item.content_en,
            }));
            fetchedMantra = [...fetchedMantra, ...mappedUserData];
          }
        }

        // Shuffle the combined array
        setMantraData(shuffleArray(fetchedMantra));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMantra();
  }, [language]);

  return { mantraData, loading, error };
};

export default useMantra;