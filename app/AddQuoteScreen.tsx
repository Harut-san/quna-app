import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../components/Button"; // Assuming your custom Button component
import { supabase } from "../constants/supabase";

const quoteCategories = [
  "wisdom",
  "Conversation Starters",
  "Mantras",
  "Daily Motivation",
  "Mindfulness Prompts",
];

export default function AddQuoteScreen() {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(quoteCategories[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmitQuote() {
    if (!content.trim()) {
      Alert.alert("Error", "Quote content cannot be empty.");
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
      content: content.trim(),
      author: author.trim() || null,
      category: selectedCategory,
    });

    if (error) {
      Alert.alert("Error adding quote", error.message);
    } else {
      Alert.alert("Success", "Quote added successfully!");
      setContent("");
      setAuthor("");
      setSelectedCategory(quoteCategories[0]);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Your Own Quote</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your quote here..."
        placeholderTextColor="#ccc"
        multiline
        value={content}
        onChangeText={setContent}
      />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
