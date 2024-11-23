// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function HomeScreen() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await api.getCompanyInfo();
      setCompanyInfo(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load company information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!companyInfo) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{companyInfo.name}</Text>
        <Text style={styles.founded}>Founded in {companyInfo.founded}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.summary}>{companyInfo.summary}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key Figures</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>CEO:</Text>
          <Text style={styles.value}>{companyInfo.ceo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>COO:</Text>
          <Text style={styles.value}>{companyInfo.coo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>CTO:</Text>
          <Text style={styles.value}>{companyInfo.cto}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Employees:</Text>
          <Text style={styles.value}>{companyInfo.employees.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{companyInfo.vehicles}</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{companyInfo.launch_sites}</Text>
            <Text style={styles.statLabel}>Launch Sites</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{companyInfo.test_sites}</Text>
            <Text style={styles.statLabel}>Test Sites</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.lastCard]}>
        <Text style={styles.sectionTitle}>Links</Text>
        <View style={styles.linksContainer}>
          {Object.entries(companyInfo.links).map(([key, url]) => (
            <TouchableOpacity
              key={key}
              style={styles.link}
              onPress={() => Linking.openURL(url)}
            >
              <Text style={styles.linkText}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...THEME.container,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  companyName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  founded: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  card: {
    ...THEME.card,
    marginBottom: 16,
  },
  lastCard: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...THEME.title,
    fontSize: 20,
  },
  summary: {
    ...THEME.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    ...THEME.text,
    fontWeight: '600',
    width: '30%',
  },
  value: {
    ...THEME.text,
    width: '70%',
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...THEME.title,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  statLabel: {
    ...THEME.text,
    fontSize: 14,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  link: {
    backgroundColor: COLORS.secondary + '20',
    padding: 12,
    borderRadius: 8,
    margin: 4,
    minWidth: '45%',
  },
  linkText: {
    ...THEME.text,
    textAlign: 'center',
    color: COLORS.secondary,
  },
});