// src/screens/RoadsterScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking,
  StyleSheet 
} from 'react-native';
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function RoadsterScreen() {
  const [roadster, setRoadster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRoadsterInfo();
  }, []);

  const fetchRoadsterInfo = async () => {
    try {
      const response = await api.getRoadster();
      setRoadster(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load Roadster information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num) => {
    return num.toLocaleString(undefined, { 
      maximumFractionDigits: 2 
    });
  };

  const handleLinkPress = async (url) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!roadster) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: roadster.flickr_images[currentImageIndex] }}
          style={styles.image}
          resizeMode="cover"
        />
        {roadster.flickr_images.length > 1 && (
          <View style={styles.imageIndicators}>
            {roadster.flickr_images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.indicatorActive
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{roadster.name}</Text>
        <Text style={styles.launchDate}>
          Launched: {formatDate(roadster.launch_date_utc)}
        </Text>

        <View style={styles.card}>
          <Text style={styles.description}>{roadster.details}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.statsGrid}>
            <StatItem
              label="Distance from Earth"
              value={`${formatNumber(roadster.earth_distance_km)} km`}
            />
            <StatItem
              label="Distance from Mars"
              value={`${formatNumber(roadster.mars_distance_km)} km`}
            />
            <StatItem
              label="Speed"
              value={`${formatNumber(roadster.speed_kph)} km/h`}
            />
            <StatItem
              label="Orbit Type"
              value={roadster.orbit_type}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Orbital Parameters</Text>
          <View style={styles.statsGrid}>
            <StatItem
              label="Apoapsis"
              value={`${roadster.apoapsis_au.toFixed(3)} AU`}
            />
            <StatItem
              label="Periapsis"
              value={`${roadster.periapsis_au.toFixed(3)} AU`}
            />
            <StatItem
              label="Period"
              value={`${Math.round(roadster.period_days)} days`}
            />
            <StatItem
              label="Inclination"
              value={`${roadster.inclination.toFixed(2)}°`}
            />
          </View>
        </View>

        <View style={[styles.card, styles.lastCard]}>
          <Text style={styles.sectionTitle}>Launch Details</Text>
          <View style={styles.statsGrid}>
            <StatItem
              label="Mass"
              value={`${roadster.launch_mass_kg} kg`}
            />
            <StatItem
              label="NORAD ID"
              value={roadster.norad_id}
            />
          </View>

          <View style={styles.linksContainer}>
            {roadster.wikipedia && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleLinkPress(roadster.wikipedia)}
              >
                <Text style={styles.linkText}>Wikipedia</Text>
              </TouchableOpacity>
            )}
            {roadster.video && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleLinkPress(roadster.video)}
              >
                <Text style={styles.linkText}>Launch Video</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text + '40',
  },
  indicatorActive: {
    backgroundColor: COLORS.text,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    ...THEME.title,
    fontSize: 28,
    marginBottom: 8,
  },
  launchDate: {
    ...THEME.text,
    color: COLORS.secondary,
    marginBottom: 24,
  },
  card: {
    ...THEME.card,
    marginBottom: 16,
  },
  lastCard: {
    marginBottom: 32,
  },
  description: {
    ...THEME.text,
    lineHeight: 24,
  },
  sectionTitle: {
    ...THEME.subtitle,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    padding: 8,
  },
  statLabel: {
    ...THEME.text,
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    ...THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  linkButton: {
    flex: 1,
    backgroundColor: COLORS.secondary + '20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    ...THEME.text,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});