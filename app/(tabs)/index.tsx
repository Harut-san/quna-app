import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Index() {
  const { translate } = useLanguage();

  return (
    <LinearGradient colors={["#101923", "#077480ff"]} style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>{translate('hello')} Harut!</Text>
        <View>
          <Card
            label={translate("wisdom")}
            screen="Wisdom"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label={translate("conversationStarters")}
            screen="ConversationStarters"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label={translate("mantras")}
            screen="Mantras"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label={translate("dailyMotivation")}
            screen="DailyMotivation"
            colors={["#cfcfcf0c", "#57575727"]}
          />
          <Card
            label={translate("mindfulnessPrompts")}
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
