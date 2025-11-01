import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";

export default function Index() {
  return (
    <LinearGradient colors={["#101923", "#077480ff"]} style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>Hello Harut!</Text>
        <View>
          <Card
            label="Wisdom"
            screen="Wisdom"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label="Conversation Starters"
            screen="ConversationStarters"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label="Mantras"
            screen="Mantras"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label="Daily Motivation"
            screen="DailyMotivation"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label="Mindfulness Prompts"
            screen="Mindfulness"
            colors={["#cfcfcf0c", "#57575727"]}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#101923",
  },
  text: {
    color: "white",
    fontSize: 24,
    marginBottom: 24,
  },
});
