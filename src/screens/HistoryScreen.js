// src/screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Linking,
  StyleSheet 
} from 'react-native';
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function HistoryScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistoricalEvents();
  }, []);

  const fetchHistoricalEvents = async () => {
    try {
      const response = await api.getHistory();
      const sortedEvents = response.data.sort((a, b) => 
        new Date(b.event_date_utc) - new Date(a.event_date_utc)
      );
      setEvents(sortedEvents);
      setError(null);
    } catch (err) {
      setError('Failed to load historical events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleArticlePress = async (url) => {
    if (url && await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleArticlePress(item.links?.article)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{formatDate(item.event_date_utc)}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      
      <Text style={styles.details}>{item.details}</Text>
      
      {item.links?.article && (
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Tap to read full article →</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>SpaceX Timeline</Text>
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...THEME.container,
  },
  headerTitle: {
    ...THEME.title,
    marginBottom: 24,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    ...THEME.card,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  date: {
    ...THEME.text,
    color: COLORS.secondary,
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    ...THEME.title,
    fontSize: 20,
  },
  details: {
    ...THEME.text,
    lineHeight: 22,
  },
  linkContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  linkText: {
    ...THEME.text,
    color: COLORS.secondary,
    fontSize: 14,
  },
});