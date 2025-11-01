import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  theme?: "primary" | "secondary" | "disabled" | "theme-default";
  onPress?: () => void;
};

const getButtonStyles = (theme?: string, isPressed?: boolean) => {
  // You can adjust the base styles for all buttons here
  const baseStyles = {
    container: styles.buttonContainer,
    button: styles.button,
    label: styles.buttonLabel,
    icon: styles.buttonIcon,
    pressable: styles.pressable,
  };

  switch (theme) {
    case "primary":
      // You can adjust the primary button colors here
      return {
        ...baseStyles,

        button: [
          styles.button,
          {
            borderWidth: 2,
            borderColor: "#c5c5c533",
            transform: [{ scale: isPressed ? 0.98 : 1 }],
          },
        ],
        label: [styles.buttonLabel, { color: "#D3D3D3" }],
        icon: [styles.buttonIcon, { color: "#D3D3D3" }],
        gradientColors: isPressed
          ? ["#cfcfcf28", "#57575744"]
          : ["#cfcfcf34", "#57575744"],
      };
    case "secondary":
      // You can adjust the secondary button colors here
      return {
        ...baseStyles,
        button: [
          styles.button,
          {
            borderWidth: 2,
            borderColor: "#c5c5c533",
            transform: [{ scale: isPressed ? 0.98 : 1 }],
          },
        ],
        label: [styles.buttonLabel, { color: "#D3D3D3" }],
        icon: [styles.buttonIcon, { color: "#D3D3D3" }],
        gradientColors: isPressed
          ? ["#cfcfcf28", "#57575744"]
          : ["#cfcfcf34", "#57575744"],
      };
    case "disabled":
      // You can adjust the disabled button colors here
      return {
        ...baseStyles,
        button: [styles.button, { borderWidth: 1, borderColor: "#808080" }],
        label: [styles.buttonLabel, { color: "#808080" }],
        icon: [styles.buttonIcon, { color: "#808080" }],
      };
    case "theme-default":
    default:
      // You can adjust the default button colors here
      return {
        ...baseStyles,
        container: [
          styles.buttonContainer,
          { borderWidth: 2, borderColor: "#c5c5c533", borderRadius: 34 },
        ],
        label: [styles.buttonLabel, { color: "#fff" }],
        icon: [styles.buttonIcon, { color: "#fff" }],
        gradientColors: isPressed
          ? ["#2c2c2c", "#1c1c1c"]
          : ["#4c4c4c", "#2c2c2c"],
      };
  }
};

export default function Button({ label, theme, onPress }: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const stylesToApply = getButtonStyles(theme, isPressed);

  const content = (
    <>
      <FontAwesome
        // name="picture-o"
        size={18}
        style={stylesToApply.icon}
      />
      <Text style={stylesToApply.label}>{label}</Text>
    </>
  );

  return (
    <View style={stylesToApply.container}>
      <Pressable
        style={stylesToApply.button}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={theme === "disabled"}
      >
        {stylesToApply.gradientColors ? (
          <LinearGradient
            colors={stylesToApply.gradientColors}
            style={stylesToApply.pressable}
          >
            {content}
          </LinearGradient>
        ) : (
          content
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    borderRadius: 32,
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 32,
  },
  pressable: {
    borderRadius: 30,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    //narazie zero
    //
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
