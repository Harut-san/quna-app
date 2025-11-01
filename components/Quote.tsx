import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text } from "react-native";

interface QuoteProps {
  quote: string;
  textStyle: any;
  gradientColors?: string[];
}

const Quote: React.FC<QuoteProps> = ({ quote, textStyle, gradientColors }) => {
  return (
    <LinearGradient
      colors={
        gradientColors || ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
      }
      style={styles.textBackgroundGradient}
    >
      <Text style={textStyle}>{quote}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  textBackgroundGradient: {
    borderRadius: 30,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#c5c5c533",
  },
});

export default Quote;
