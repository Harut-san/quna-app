import { StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Harut!</Text>
      <View>
        <Card label="Advices" screen="Advices" />
        <Card label="Conversation Starters" screen="ConversationStarters" />
        <Card label="Mantras" screen="Mantras" />
        <Card label="Daily Motivation" screen="DailyMotivation" />
        <Card label="Mindfulness Prompts" screen="Mindfulness" />
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
  link: {
    fontSize: 24,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
