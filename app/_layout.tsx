import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { LogBox, SafeAreaView } from "react-native";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AuthScreen from "./AuthScreen";
import { useFonts } from "expo-font";
import { AntDesign } from "@expo/vector-icons";

LogBox.ignoreAllLogs(true); // Ignore all log notifications

function RootLayoutContent() {
  const { session, loading: authLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    ...AntDesign.font,
    TimesNewRoman: require("../assets/fonts/TimesNewRoman.ttf"),
  });

  if (authLoading || !fontsLoaded) {
    return null; // Or a loading indicator
  }

  return (
    <LanguageProvider>
      <StatusBar style="light" />
      {session && session.user ? (
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "",
              headerShown: false,
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#101923" }}>
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
  headerTitleAlign: "center",
  headerShadowVisible: false,
};
