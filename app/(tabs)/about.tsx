import { StyleSheet, View } from "react-native";
import Button from "../../components/Button";
import ImageViewer from "../../components/ImageViewer";
import { useLanguage } from "../../contexts/LanguageContext";
import { APP_VERSION } from "../../constants/AppInfo";

const PlaceholderImage = require("../../assets/images/background-image.png");

export default function AboutScreen() {
  const { translate } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button
          label={translate("beginYourJourney")}
          theme="primary"
          onPress={() => alert(`Quna v${APP_VERSION}\n© 2024 ${translate("qunaInc")}.`)}
        />
        <Button label={translate("disabled")}
          theme="disabled" />
        <Button label={translate("secondary")}
          theme="secondary" />
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
