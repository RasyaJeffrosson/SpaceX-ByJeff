// src/screens/LaunchesScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput,
  StyleSheet 
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import LaunchDetailScreen from './LaunchDetailScreen';

const Stack = createNativeStackNavigator();

const LaunchesList = ({ navigation }) => {
  const [launches, setLaunches] = useState([]);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLaunches();
  }, []);

  useEffect(() => {
    if (launches.length > 0) {
      const filtered = launches.filter(launch =>
        launch.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLaunches(filtered);
    }
  }, [searchQuery, launches]);

  const fetchLaunches = async () => {
    try {
      const response = await api.getLaunches();
      const sortedLaunches = response.data.sort((a, b) => 
        new Date(b.date_utc) - new Date(a.date_utc)
      );
      setLaunches(sortedLaunches);
      setFilteredLaunches(sortedLaunches);
      setError(null);
    } catch (err) {
      setError('Failed to load launches');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderLaunchCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LaunchDetail', { launchId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ 
            uri: item.links?.patch?.small || 'https://via.placeholder.com/100'
          }}
          style={styles.missionPatch}
          resizeMode="contain"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.missionName}>{item.name}</Text>
          <Text style={styles.date}>{formatDate(item.date_utc)}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text 
          style={styles.details} 
          numberOfLines={2}
        >
          {item.details || 'No mission details available'}
        </Text>

        <View style={styles.statsContainer}>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: item.success 
                ? COLORS.success + '40' 
                : item.upcoming 
                  ? COLORS.secondary + '40'
                  : COLORS.error + '40'
            }
          ]}>
            <Text style={[
              styles.statusText,
              { 
                color: item.success 
                  ? COLORS.success 
                  : item.upcoming 
                    ? COLORS.secondary
                    : COLORS.error
              }
            ]}>
              {item.upcoming 
                ? 'Upcoming' 
                : item.success 
                  ? 'Successful' 
                  : 'Failed'}
            </Text>
          </View>

          {item.cores && item.cores[0]?.reused && (
            <View style={[styles.statusBadge, { backgroundColor: COLORS.accent + '40' }]}>
              <Text style={[styles.statusText, { color: COLORS.accent }]}>
                Reused
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search launches..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredLaunches}
        renderItem={renderLaunchCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const LaunchesScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LaunchesList" 
        component={LaunchesList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LaunchDetail"
        component={LaunchDetailScreen}
        options={{ 
          title: 'Launch Details',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.text,
        }}
      />
    </Stack.Navigator>
  );
};


const styles = StyleSheet.create({
  container: {
    ...THEME.container,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    ...THEME.card,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionPatch: {
    width: 60,
    height: 60,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 30,
  },
  headerInfo: {
    flex: 1,
  },
  missionName: {
    ...THEME.title,
    fontSize: 18,
    marginBottom: 4,
  },
  date: {
    ...THEME.text,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  cardContent: {
    gap: 12,
  },
  details: {
    ...THEME.text,
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});


export default LaunchesScreen