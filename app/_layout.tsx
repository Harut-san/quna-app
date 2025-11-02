import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { LogBox, SafeAreaView } from "react-native";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AuthScreen from "./AuthScreen";
import * as Font from "expo-font";
import { AntDesign } from '@expo/vector-icons';

LogBox.ignoreAllLogs(true); // Ignore all log notifications

function RootLayoutContent() {
  const { session, loading: authLoading } = useAuth();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadAppFonts() {
      try {
        await Font.loadAsync(AntDesign.font);
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    }

    loadAppFonts();
  }, []);

  if (authLoading || !fontsLoaded) {
    // You might want to render a loading spinner here
    return null; // Or a simple loading indicator
  }

  return (
    <LanguageProvider>
      <StatusBar style="light" /> {/* sets clock and battery style to light */}
      {session && session.user ? (
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "",
              headerShown: false, //property to prevent redndering header
            }}
          />
          <Stack.Screen name="+not-found" options={{}} />

          <Stack.Screen
            name="Wisdom"
            options={{ title: "Wisdom", ...commonOptions }}
          />
          <Stack.Screen
            name="ConversationStarters"
            options={{ title: "Conversation Starters", ...commonOptions }}
          />
          <Stack.Screen
            name="DailyMotivation"
            options={{ title: "DailyMotivation", ...commonOptions }}
          />
          <Stack.Screen
            name="Mantras"
            options={{ title: "Mantras", ...commonOptions }}
          />
          <Stack.Screen
            name="Mindfulness"
            options={{ title: "Mindfulness", ...commonOptions }}
          />
        </Stack>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#101923' }}>
          <AuthScreen />
        </SafeAreaView>
      )}
    </LanguageProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

const commonOptions = {
  headerStyle: { backgroundColor: "#101923" },
  headerTintColor: "#fff",
  headerTitleAlign: "center", //help
  headerShadowVisible: false, //help

  // HeaderTitle: { alignSelf: "center" },
  // headerTitleStyle: { fontWeight: 900 },
};
