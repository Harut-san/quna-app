import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        headerStyle: { backgroundColor: "#101923" },
        headerTintColor: "#fff",
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: "#101923", paddingTop: 10 },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="about"
        options={{
          headerTitle: "QUNA",
          tabBarLabel(props) {
            return null; // Hide tab label
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "heart-circle-sharp" : "heart-circle-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          tabBarLabel(props) {
            return null; // Hide tab label
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "filter-circle" : "filter-circle-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          tabBarLabel(props) {
            return null; // Hide tab label
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "reorder-four-sharp" : "reorder-four-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen name="+not-found" options={{}} />
    </Tabs>
  );
}
