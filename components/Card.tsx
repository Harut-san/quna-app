import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  screen?: string;
};

export default function Card({ label, screen }: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={styles.card}
        onPress={() => {
          navigation.navigate(screen as never);
        }}
      >
        <Text style={styles.cardLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 400,
    height: 100,
    marginBottom: 5,
    marginTop: 5,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  card: {
    borderRadius: 30,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#00000033",
    backgroundColor: "#1C2938",
  },
  cardIcon: {
    paddingRight: 8,
  },
  cardLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
