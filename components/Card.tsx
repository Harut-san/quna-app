import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  screen?: string;
  colors: string[];
};

export default function Card({ label, screen, colors }: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.cardContainer}>
      <LinearGradient colors={colors} style={styles.card}>
        <Pressable
          style={styles.pressable}
          onPress={() => {
            navigation.navigate(screen as never);
          }}
        >
          <Text style={styles.cardLabel}>{label}</Text>
        </Pressable>
      </LinearGradient>
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
    borderWidth: 2,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#c5c5c533",
  },
  pressable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    paddingRight: 8,
  },
  cardLabel: {
    color: "#fff",
    fontSize: 20,
  },
});
