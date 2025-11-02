import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../constants/supabase"; // Adjust path if necessary
import Button from "./../components/Button";
import ImageViewer from "./../components/ImageViewer";

const PlaceholderImage = require("./../assets/images/quna-no-bg-logo.png");

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert("Please enter your email to reset password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "YOUR_APP_DEEPLINK_URL_FOR_PASSWORD_RESET", // IMPORTANT: Replace with your app's deep link
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert(
        "Password reset email sent!",
        "Check your email for the reset link."
      );
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <Text style={styles.title}>Welcome</Text>
      <View style={[styles.verticallySpaced]}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
        <Text style={styles.forgotPasswordText} onPress={handleForgotPassword}>
          Forgot Password?
        </Text>
      </View>
      <View style={styles.buttonContainerSticky}>
        <Button
          label="Sign in"
          theme={loading ? "disabled" : "primary"}
          onPress={() => signInWithEmail()}
        />
        <Button
          label="Sign up"
          theme={loading ? "disabled" : "secondary"}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align to top
    alignItems: "center", // Center horizontally
    padding: 20,
    backgroundColor: "#101923",
  },
  imageContainer: {
    marginBottom: 30, // Space below logo
    marginTop: 50, // Space from top of safe area
    height: 130,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 0 }, // No offset, for a glare effect
    shadowOpacity: 1, // Adjust for desired intensity
    shadowRadius: 30, // Adjust for desired spread
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    // Removed marginTop: 200
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch", // Allow inputs to stretch horizontally
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  buttonContainerSticky: {
    // position: "absolute", // Keep this if you want it sticky at the bottom
    // bottom: 20,
    // left: 0,
    // right: 0,
    paddingBottom: 20,
    alignItems: "center",
    marginTop: 30, // Space above buttons
  },
  forgotPasswordText: {
    color: "#ADD8E6", // Light blue for a link
    textAlign: "right",
    marginTop: 8,
    marginBottom: 16,
    textDecorationLine: "underline",
  },
});
