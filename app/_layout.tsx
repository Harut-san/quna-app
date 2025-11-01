import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true); // Ignore all log notifications

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" /> {/* sets clock and battery style to light */}
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
          options={{ title: "Daily Motivation", ...commonOptions }}
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
    </>
  );
}

const commonOptions = {
  headerStyle: { backgroundColor: "#101923" },
  headerTintColor: "#00bfa6",
  headerTitleAlign: "center", //help
  headerShadowVisible: false, //help

  // HeaderTitle: { alignSelf: "center" },
  // headerTitleStyle: { fontWeight: 900 },
};
