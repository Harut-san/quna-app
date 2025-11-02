import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../components/Button"; // Assuming your custom Button component
import { supabase } from "../constants/supabase";

const quoteCategories = [
  "Wisdom",
  "Conversation Starters",
  "Mantras",
  "Daily Motivation",
  "Mindfulness Prompts",
];

export default function AddQuoteScreen() {
  const [contentEn, setContentEn] = useState("");
  const [contentPl, setContentPl] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(quoteCategories[0]);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // 'en', 'pl', or 'both'
  const [loading, setLoading] = useState(false);

  async function handleSubmitQuote() {
    if (selectedLanguage === "en" && !contentEn.trim()) {
      Alert.alert("Error", "English quote content cannot be empty.");
      return;
    }
    if (selectedLanguage === "pl" && !contentPl.trim()) {
      Alert.alert("Error", "Polish quote content cannot be empty.");
      return;
    }
    if (
      selectedLanguage === "both" &&
      (!contentEn.trim() || !contentPl.trim())
    ) {
      Alert.alert("Error", "Both English and Polish quote content cannot be empty.");
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "You must be logged in to add a quote.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("user_content").insert({
      user_id: user.id,
      content_en: contentEn.trim() || null,
      content_pl: contentPl.trim() || null,
      language: selectedLanguage,
      author: author.trim() || null,
      category: selectedCategory,
    });

    if (error) {
      Alert.alert("Error adding quote", error.message);
    } else {
      Alert.alert("Success", "Quote added successfully!");
      setContentEn("");
      setContentPl("");
      setAuthor("");
      setSelectedCategory(quoteCategories[0]);
      setSelectedLanguage("en");
    }
    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Add Your Own Quote</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Polish" value="pl" />
          <Picker.Item label="Both (English & Polish)" value="both" />
        </Picker>
      </View>

      {(selectedLanguage === "en" || selectedLanguage === "both") && (
        <TextInput
          style={styles.input}
          placeholder="Enter your quote in English (max 600 chars)"
          placeholderTextColor="#ccc"
          multiline
          value={contentEn}
          onChangeText={setContentEn}
          maxLength={600}
        />
      )}

      {(selectedLanguage === "pl" || selectedLanguage === "both") && (
        <TextInput
          style={styles.input}
          placeholder="Wpisz cytat po polsku (max 600 znaków)"
          placeholderTextColor="#ccc"
          multiline
          value={contentPl}
          onChangeText={setContentPl}
          maxLength={600}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Author (optional)"
        placeholderTextColor="#ccc"
        value={author}
        onChangeText={setAuthor}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {quoteCategories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          label={loading ? "Adding..." : "Add Quote"}
          theme={loading ? "disabled" : "primary"}
          onPress={handleSubmitQuote}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#101923",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#25292e",
    color: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#25292e",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    color: "white",
  },
  pickerItem: {
    color: "white",
    backgroundColor: "#25292e",
  },
});
