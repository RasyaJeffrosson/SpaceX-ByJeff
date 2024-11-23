// src/components/ErrorMessage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const ErrorMessage = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.error + '20',
    borderRadius: 8,
    margin: 16,
  },
  text: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: 16,
  },
});