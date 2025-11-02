import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = "https://gtjmvzvxbwdqsgzfefqg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0am12enZ4YndkcXNnemZlZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzIxMDUsImV4cCI6MjA3NzYwODEwNX0.fAlQ55YVMqbC8lp3HZfmbQaqz9rS_4QgnQZANfLjcs8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
