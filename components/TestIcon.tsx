import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const TestIcon = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Testing AntDesign Heart Icon:</Text>
      <AntDesign name="heart" size={50} color="purple" />
      <Text style={styles.text}>Testing AntDesign Hearto Icon:</Text>
      <AntDesign name="hearto" size={50} color="orange" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
});

export default TestIcon;
