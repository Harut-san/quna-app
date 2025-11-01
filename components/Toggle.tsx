import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface ToggleProps {
  label: string;
  isOn: boolean;
  onToggle: (value: boolean) => void;
  onLabel?: string;
  offLabel?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, isOn, onToggle, onLabel, offLabel }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}: {isOn ? onLabel : offLabel}
      </Text>
      <Switch
        trackColor={{ false: '#767577', true: '#fff' }}
        thumbColor={isOn ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggle}
        value={isOn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
});

export default Toggle;
