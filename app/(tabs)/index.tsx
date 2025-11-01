import { StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Harut!</Text>
      <View>
        <Card
          label="Wisdom"
          screen="Wisdom"
          colors={["#10192347", "#3a000044"]}
        />
        <Card
          label="Conversation Starters"
          screen="ConversationStarters"
          colors={["#10192346", "#00555d3f"]}
        />
        <Card
          label="Mantras"
          screen="Mantras"
          colors={["#10192347", "#6f00663a"]}
        />
        <Card
          label="Daily Motivation"
          screen="DailyMotivation"
          colors={["#10192347", "#003a0540"]}
        />
        <Card
          label="Mindfulness Prompts"
          screen="Mindfulness"
          colors={["#101923", "#0048ac49"]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101923",
  },
  text: {
    color: "white",
    fontSize: 24,
    marginBottom: 24,
  },
});
