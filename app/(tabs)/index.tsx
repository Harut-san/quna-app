import { StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Harut!</Text>
      <View>
        <Card label="Wisdom" screen="Wisdom" colors={["#101923", "#3a0000"]} />
        <Card
          label="Conversation Starters"
          screen="ConversationStarters"
          colors={["#101923", "#00565dff"]}
        />
        <Card
          label="Mantras"
          screen="Mantras"
          colors={["#101923", "#6f0066ff"]}
        />
        <Card
          label="Daily Motivation"
          screen="DailyMotivation"
          colors={["#101923", "#003a05ff"]}
        />
        <Card
          label="Mindfulness Prompts"
          screen="Mindfulness"
          colors={["#101923", "#0048acff"]}
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
