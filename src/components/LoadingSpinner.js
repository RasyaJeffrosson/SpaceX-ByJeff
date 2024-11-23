// src/components/LoadingSpinner.js
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const LoadingSpinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS.secondary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});