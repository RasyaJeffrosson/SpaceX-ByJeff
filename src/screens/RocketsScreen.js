// src/screens/RocketsScreen.js
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
import RocketDetailScreen from './RocketDetailScreen';

const Stack = createNativeStackNavigator();

const RocketsList = ({ navigation }) => {
  const [rockets, setRockets] = useState([]);
  const [filteredRockets, setFilteredRockets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRockets();
  }, []);

  useEffect(() => {
    if (rockets.length > 0) {
      const filtered = rockets.filter(rocket =>
        rocket.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRockets(filtered);
    }
  }, [searchQuery, rockets]);

  const fetchRockets = async () => {
    try {
      const response = await api.getRockets();
      setRockets(response.data);
      setFilteredRockets(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load rockets');
    } finally {
      setLoading(false);
    }
  };

  const renderRocketCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RocketDetail', { rocketId: item.id })}
    >
      {item.flickr_images && item.flickr_images.length > 0 && (
        <Image
          source={{ uri: item.flickr_images[0] }}
          style={styles.rocketImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.rocketName}>{item.name}</Text>
        <Text style={styles.rocketType}>{item.type}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {item.height?.meters}m
            </Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {item.mass?.kg.toLocaleString()}kg
            </Text>
            <Text style={styles.statLabel}>Mass</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {item.success_rate_pct}%
            </Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.active ? COLORS.success + '40' : COLORS.error + '40' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.active ? COLORS.success : COLORS.error }
            ]}>
              {item.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
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
          placeholder="Search rockets..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredRockets}
        renderItem={renderRocketCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const RocketsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RocketsList" 
        component={RocketsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RocketDetail"
        component={RocketDetailScreen}
        options={{
          title: 'Rocket Details',
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
    overflow: 'hidden',
  },
  rocketImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  cardContent: {
    marginTop: 12,
  },
  rocketName: {
    ...THEME.title,
    marginBottom: 4,
  },
  rocketType: {
    ...THEME.text,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...THEME.text,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  statLabel: {
    ...THEME.text,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
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

export default RocketsScreen;