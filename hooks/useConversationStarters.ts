import { useState, useEffect } from 'react';
import { supabase } from '../constants/supabase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../contexts/LanguageContext";

interface ConversationStarterItem {
  id: string;
  author: string;
  content: string;
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

const useConversationStarters = () => {
  const [conversationStartersData, setConversationStartersData] = useState<ConversationStarterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteSourcePreference, setQuoteSourcePreference] = useState<QuoteSource>('both');
  const { language } = useLanguage();

  useEffect(() => {
    const fetchConversationStarters = async () => {
      setLoading(true);
      setError(null);
      let fetchedConversationStarters: ConversationStarterItem[] = [];

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
            fetchedConversationStarters = [...fetchedConversationStarters, ...mappedMasterData];
          }
        }

        if (currentPreference === 'user' || currentPreference === 'both') {
          const { data: userData, error: userError } = await supabase
            .from('user_content')
            .select('id, author, content')
            .eq('category', 'Conversation Starters'); // Filter by category 'Conversation Starters'

          if (userError) {
            throw userError;
          }
          if (userData) {
            fetchedConversationStarters = [...fetchedConversationStarters, ...userData];
          }
        }

        // Shuffle the combined array
        setConversationStartersData(shuffleArray(fetchedConversationStarters));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversationStarters();
  }, [language]);

  return { conversationStartersData, loading, error };
};

export default useConversationStarters;
