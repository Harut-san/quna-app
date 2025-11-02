import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const heartFilled = require("../assets/images/heart-filled.svg");
const heartOutlined = require("../assets/images/heart-outlined.svg");

interface QuoteProps {
  quote: string;
  author?: string | null;
  gradientColors?: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

import { Feather } from "@expo/vector-icons";
const Quote: React.FC<QuoteProps> = ({
  quote,
  author,
  gradientColors,
  isFavorite,
  onToggleFavorite,
  onDelete,
}) => {
  const defaultTextStyle = {
    fontFamily: "TimesNewRoman",
    textAlign: "center",
    color: "white",
    fontSize: 30,
    fontStyle: "italic",
    marginHorizontal: 5,
  };

  return (
    <LinearGradient
      colors={
        gradientColors || ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
      }
      style={styles.textBackgroundGradient}
    >
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Feather name="trash-2" size={24} color="white" />
        </TouchableOpacity>
      )}
      <Text style={defaultTextStyle}>{quote}</Text>
      {author ? <Text style={styles.authorText}>{author}</Text> : null}
      {onToggleFavorite && (
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <Image
            source={isFavorite ? heartFilled : heartOutlined}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      )}
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
    width: "86%",
    borderColor: "#c5c5c533",
    paddingTop: 50,
    paddingBottom: 50,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 5,
  },
  authorText: {
    fontFamily: "TimesNewRoman",
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 10,
  },
});

export default Quote;
