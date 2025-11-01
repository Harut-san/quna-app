import { StyleSheet, View } from "react-native";
import Button from "../../components/Button";
import ImageViewer from "../../components/ImageViewer";

const PlaceholderImage = require("../../assets/images/background-image.png");

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button
          label="Begin Your Journey"
          theme="primary"
          onPress={() => alert("Quna v1.0.0\n© 2024 Quna Inc.")}
        />
        <Button
          label="Log in"
          // onPress={() => alert("Quna v1.0.0\n© 2024 Quna Inc.")}
        />
        <Button label="disabled" theme="disabled" />
        <Button label="secondary" theme="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
  link: {
    fontSize: 24,
    textDecorationLine: "underline",
    color: "#fff",
  },
  imageContainer: {
    flex: 1 / 3,
    // marginTop: 50,
  },

  footerContainer: {
    flex: 1,
    alignItems: "center",
  },
});
