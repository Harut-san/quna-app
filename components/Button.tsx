import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  theme?: "primary" | "secondary" | "disabled";
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === "primary") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 2, borderColor: "#00bfa6", borderRadius: 34 },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={onPress}
        >
          <FontAwesome
            // name="picture-o"
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  } else if (theme === "secondary") {
    return (
      <View style={[styles.buttonContainer]}>
        <Pressable
          style={[styles.button, { borderWidth: 2, borderColor: "#D3D3D3" }]}
          onPress={onPress}
        >
          <FontAwesome size={18} color="#D3D3D3" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: "#D3D3D3" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  } else if (theme === "disabled") {
    return (
      <View style={[styles.buttonContainer]}>
        <Pressable
          style={[styles.button, { borderWidth: 2, borderColor: "#808080" }]}
          disabled={true}
        >
          <FontAwesome size={18} color="#808080" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: "#808080" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.buttonContainer]}>
      <Pressable
        style={[styles.button, { borderWidth: 2, borderColor: "#D3D3D3" }]}
        onPress={onPress}
      >
        <FontAwesome size={18} color="#D3D3D3" style={styles.buttonIcon} />
        <Text style={[styles.buttonLabel, { color: "#D3D3D3" }]}>{label}</Text>
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
    padding: 4,
  },
  button: {
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
