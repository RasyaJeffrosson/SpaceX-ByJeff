// src/screens/RocketDetailScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  Dimensions,
  Linking,
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

const { width } = Dimensions.get('window');

export default function RocketDetailScreen({ route }) {
  const [rocket, setRocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { rocketId } = route.params;

  useEffect(() => {
    fetchRocketDetails();
  }, []);

  const fetchRocketDetails = async () => {
    try {
      const response = await api.getRocketById(rocketId);
      setRocket(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load rocket details');
    } finally {
      setLoading(false);
    }
  };

  const handleWikiPress = async () => {
    if (rocket?.wikipedia) {
      try {
        await Linking.openURL(rocket.wikipedia);
      } catch (err) {
        // Handle error opening URL
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!rocket) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        {rocket.flickr_images && rocket.flickr_images.length > 0 && (
          <>
            <Image
              source={{ uri: rocket.flickr_images[currentImageIndex] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            {rocket.flickr_images.length > 1 && (
              <View style={styles.imagePagination}>
                {rocket.flickr_images.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                    style={[
                      styles.paginationDot,
                      currentImageIndex === index && styles.paginationDotActive
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.rocketName}>{rocket.name}</Text>
          <Text style={styles.rocketType}>{rocket.type}</Text>
          <View style={styles.activeStatus}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: rocket.active ? COLORS.success + '40' : COLORS.error + '40' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: rocket.active ? COLORS.success : COLORS.error }
              ]}>
                {rocket.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>{rocket.description}</Text>
        </View>

        {/* Basic Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsGrid}>
            <SpecItem 
              label="Height" 
              value={`${rocket.height?.meters || 'N/A'}m / ${rocket.height?.feet || 'N/A'}ft`}
            />
            <SpecItem 
              label="Diameter" 
              value={`${rocket.diameter?.meters || 'N/A'}m / ${rocket.diameter?.feet || 'N/A'}ft`}
            />
            <SpecItem 
              label="Mass" 
              value={`${rocket.mass?.kg?.toLocaleString() || 'N/A'} kg`}
            />
            <SpecItem 
              label="Stages" 
              value={rocket.stages || 'N/A'}
            />
          </View>
        </View>

        {/* Engine Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engine Details</Text>
          <View style={styles.engineDetails}>
            <EngineSpec label="Type" value={rocket.engines?.type} />
            <EngineSpec label="Version" value={rocket.engines?.version} />
            <EngineSpec label="Layout" value={rocket.engines?.layout} />
            <EngineSpec label="Number" value={rocket.engines?.number} />
            <EngineSpec 
              label="Propellants" 
              value={`${rocket.engines?.propellant_1 || 'N/A'} / ${rocket.engines?.propellant_2 || 'N/A'}`} 
            />
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceGrid}>
            <StatBox 
              label="Success Rate" 
              value={`${rocket.success_rate_pct || 0}%`} 
            />
            <StatBox 
              label="Cost per Launch" 
              value={`$${(rocket.cost_per_launch / 1000000).toFixed(1)}M`} 
            />
          </View>
        </View>

        {/* Payload Information */}
        {rocket.payload_weights && rocket.payload_weights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payload Capacity</Text>
            {rocket.payload_weights.map((payload, index) => (
              <View key={index} style={styles.payloadItem}>
                <Text style={styles.payloadName}>{payload.name}:</Text>
                <Text style={styles.payloadWeight}>
                  {payload.kg?.toLocaleString() || 'N/A'} kg / {payload.lb?.toLocaleString() || 'N/A'} lb
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Additional Information */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.additionalInfo}>
            <InfoItem label="First Flight" value={rocket.first_flight || 'N/A'} />
            <InfoItem label="Country" value={rocket.country || 'N/A'} />
            <InfoItem label="Company" value={rocket.company || 'N/A'} />
          </View>

          {rocket.wikipedia && (
            <TouchableOpacity 
              style={styles.wikiButton}
              onPress={handleWikiPress}
            >
              <Text style={styles.wikiButtonText}>View on Wikipedia</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const SpecItem = ({ label, value }) => (
  <View style={styles.specItem}>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>{value}</Text>
  </View>
);

const EngineSpec = ({ label, value }) => (
  <View style={styles.engineSpec}>
    <Text style={styles.engineLabel}>{label}:</Text>
    <Text style={styles.engineValue}>{value || 'N/A'}</Text>
  </View>
);

const StatBox = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    width: '100%',
    height: width * 0.75,
    backgroundColor: COLORS.surface,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text + '40',
  },
  paginationDotActive: {
    backgroundColor: COLORS.text,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  rocketName: {
    ...THEME.title,
    fontSize: 28,
    marginBottom: 4,
  },
  rocketType: {
    ...THEME.text,
    color: COLORS.textSecondary,
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  activeStatus: {
    flexDirection: 'row',
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
  section: {
    ...THEME.card,
    marginBottom: 16,
  },
  lastSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...THEME.subtitle,
    marginBottom: 16,
  },
  description: {
    ...THEME.text,
    lineHeight: 24,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  specItem: {
    width: '50%',
    padding: 8,
  },
  specLabel: {
    ...THEME.text,
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  specValue: {
    ...THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  engineDetails: {
    gap: 8,
  },
  engineSpec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  engineLabel: {
    ...THEME.text,
    color: COLORS.textSecondary,
  },
  engineValue: {
    ...THEME.text,
    fontWeight: '500',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    ...THEME.title,
    color: COLORS.secondary,
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    ...THEME.text,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  payloadItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  payloadName: {
    ...THEME.text,
    color: COLORS.textSecondary,
  },
  payloadWeight: {
    ...THEME.text,
    fontWeight: '500',
  },
  additionalInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    ...THEME.text,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...THEME.text,
    fontWeight: '500',
  },
  wikiButton: {
    backgroundColor: COLORS.secondary + '20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  wikiButtonText: {
    ...THEME.text,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});