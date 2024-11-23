// src/screens/LaunchDetailScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking,
  FlatList,
  Dimensions,
  StyleSheet 
} from 'react-native';
import { api } from '../services/api';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LaunchDetailScreen = ({ route }) => {
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { launchId } = route.params;

  useEffect(() => {
    fetchLaunchDetails();
  }, []);

  const fetchLaunchDetails = async () => {
    try {
      const response = await api.getLaunchById(launchId);
      setLaunch(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load launch details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleLinkPress = async (url) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!launch) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ 
            uri: launch.links?.patch?.large || 
                 launch.links?.patch?.small || 
                 'https://via.placeholder.com/200'
          }}
          style={styles.missionPatch}
          resizeMode="contain"
        />
        <Text style={styles.missionName}>{launch.name}</Text>
        <Text style={styles.flightNumber}>Flight #{launch.flight_number || 'N/A'}</Text>
      </View>

      {/* Mission Status */}
      <View style={styles.statusSection}>
        <View style={[
          styles.statusBadge,
          { 
            backgroundColor: launch.success 
              ? COLORS.success + '40' 
              : launch.upcoming 
                ? COLORS.secondary + '40'
                : COLORS.error + '40'
          }
        ]}>
          <Text style={[
            styles.statusText,
            { 
              color: launch.success 
                ? COLORS.success 
                : launch.upcoming 
                  ? COLORS.secondary
                  : COLORS.error
            }
          ]}>
            {launch.upcoming 
              ? 'Upcoming' 
              : launch.success 
                ? 'Successful' 
                : 'Failed'}
          </Text>
        </View>
      </View>

      {/* Mission Details */}
      {launch.details && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission Details</Text>
          <Text style={styles.details}>{launch.details}</Text>
        </View>
      )}

      {/* Launch Timing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Launch Timing</Text>
        <View style={styles.timingInfo}>
          <DetailRow 
            label="Launch Date" 
            value={formatDate(launch.date_utc)} 
          />
          <DetailRow 
            label="Local Time" 
            value={new Date(launch.date_local).toLocaleTimeString()} 
          />
          {launch.static_fire_date_utc && (
            <DetailRow 
              label="Static Fire" 
              value={formatDate(launch.static_fire_date_utc)} 
            />
          )}
          <DetailRow 
            label="Launch Window" 
            value={launch.window ? `${launch.window} seconds` : 'Instantaneous'} 
          />
        </View>
      </View>

      {/* Cores Information */}
      {launch.cores && launch.cores.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Information</Text>
          {launch.cores.map((core, index) => (
            <View key={index} style={styles.coreCard}>
              <Text style={styles.coreTitle}>
                Core #{index + 1} - {launch.cores_details?.[index]?.serial || 'Unknown Serial'}
              </Text>
              
              {/* Core Status */}
              <View style={styles.coreStatusContainer}>
                <View style={[
                  styles.coreStatusBadge,
                  { 
                    backgroundColor: launch.cores_details?.[index]?.status === 'active' 
                      ? COLORS.success + '40' 
                      : COLORS.error + '40'
                  }
                ]}>
                  <Text style={styles.coreStatusText}>
                    {launch.cores_details?.[index]?.status?.toUpperCase() || 'UNKNOWN'}
                  </Text>
                </View>
              </View>

              {/* Core Details */}
              <View style={styles.coreDetails}>
                <DetailRow 
                  label="Block" 
                  value={launch.cores_details?.[index]?.block || 'Unknown'} 
                />
                <DetailRow 
                  label="Reuse Count" 
                  value={launch.cores_details?.[index]?.reuse_count || 0} 
                />
                <DetailRow 
                  label="Flight Number" 
                  value={core.flight || 'Unknown'} 
                />
                <DetailRow 
                  label="Landing Type" 
                  value={core.landing_type || 'N/A'} 
                />
                
                {/* Landing Statistics */}
                <View style={styles.landingStats}>
                  <View style={styles.landingStat}>
                    <Text style={styles.landingStatValue}>
                      {launch.cores_details?.[index]?.rtls_landings || 0}/{launch.cores_details?.[index]?.rtls_attempts || 0}
                    </Text>
                    <Text style={styles.landingStatLabel}>RTLS</Text>
                  </View>
                  <View style={styles.landingStat}>
                    <Text style={styles.landingStatValue}>
                      {launch.cores_details?.[index]?.asds_landings || 0}/{launch.cores_details?.[index]?.asds_attempts || 0}
                    </Text>
                    <Text style={styles.landingStatLabel}>ASDS</Text>
                  </View>
                </View>

                {/* Core Status */}
                {launch.cores_details?.[index]?.last_update && (
                  <View style={styles.coreUpdate}>
                    <Text style={styles.coreUpdateText}>
                      {launch.cores_details[index].last_update}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Payloads Information */}
      {launch.payloads_details && launch.payloads_details.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payloads</Text>
          {launch.payloads_details.map((payload, index) => (
            <View key={index} style={styles.payloadCard}>
              <Text style={styles.payloadName}>{payload.name || 'Unknown Payload'}</Text>
              
              <View style={styles.payloadDetails}>
                <DetailRow 
                  label="Type" 
                  value={payload.type || 'Unknown'} 
                />
                <DetailRow 
                  label="Mass" 
                  value={payload.mass_kg ? `${payload.mass_kg} kg` : 'Unknown'} 
                />
                <DetailRow 
                  label="Orbit" 
                  value={payload.orbit || 'Unknown'} 
                />
                <DetailRow 
                  label="Regime" 
                  value={payload.regime || 'Unknown'} 
                />
                
                {/* Customers & Manufacturers */}
                {payload.customers && (
                  <DetailRow 
                    label="Customers" 
                    value={payload.customers.join(', ')} 
                  />
                )}
                {payload.manufacturers && (
                  <DetailRow 
                    label="Manufacturers" 
                    value={payload.manufacturers.join(', ')} 
                  />
                )}
                
                {/* Orbital Parameters */}
                {payload.orbit && (
                  <View style={styles.orbitalParams}>
                    <Text style={styles.orbitalTitle}>Orbital Parameters</Text>
                    <DetailRow 
                      label="Period" 
                      value={payload.period_min ? `${payload.period_min} min` : 'Unknown'} 
                    />
                    <DetailRow 
                      label="Inclination" 
                      value={payload.inclination_deg ? `${payload.inclination_deg}°` : 'Unknown'} 
                    />
                    <DetailRow 
                      label="Lifespan" 
                      value={payload.lifespan_years ? `${payload.lifespan_years} years` : 'Unknown'} 
                    />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Launch Site Information */}
      {launch.launchpad_details && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Launch Site</Text>
          <View style={styles.launchpadCard}>
            <Text style={styles.launchpadName}>
              {launch.launchpad_details.full_name || 'Unknown Location'}
            </Text>
            
            <View style={styles.launchpadStats}>
              <View style={styles.launchpadStat}>
                <Text style={styles.statValue}>
                  {launch.launchpad_details.launch_attempts || 0}
                </Text>
                <Text style={styles.statLabel}>Total Attempts</Text>
              </View>
              <View style={styles.launchpadStat}>
                <Text style={styles.statValue}>
                  {launch.launchpad_details.launch_successes || 0}
                </Text>
                <Text style={styles.statLabel}>Successful</Text>
              </View>
            </View>

            <View style={styles.launchpadDetails}>
              <DetailRow 
                label="Location" 
                value={`${launch.launchpad_details.locality || 'Unknown'}, ${launch.launchpad_details.region || 'Unknown'}`} 
              />
              <DetailRow 
                label="Timezone" 
                value={launch.launchpad_details.timezone || 'Unknown'} 
              />
              <DetailRow 
                label="Status" 
                value={launch.launchpad_details.status ? launch.launchpad_details.status.toUpperCase() : 'Unknown'} 
              />
            </View>
          </View>
        </View>
      )}

      {/* Media Gallery */}
      {launch.links?.flickr?.original && launch.links.flickr.original.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission Gallery</Text>
          <FlatList
            horizontal
            data={launch.links.flickr.original}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            )}
          />
        </View>
      )}

      {/* Links */}
      {launch.links && (
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <View style={styles.linksGrid}>
            {launch.links.presskit && (
              <LinkButton
                icon="document-text"
                label="Press Kit"
                onPress={() => handleLinkPress(launch.links.presskit)}
              />
            )}
            {launch.links.webcast && (
              <LinkButton
                icon="logo-youtube"
                label="Watch Launch"
                onPress={() => handleLinkPress(launch.links.webcast)}
              />
            )}
            {launch.links.article && (
              <LinkButton
                icon="newspaper"
                label="Read Article"
                onPress={() => handleLinkPress(launch.links.article)}
              />
            )}
            {launch.links.wikipedia && (
              <LinkButton
                icon="logo-wikipedia"
                label="Wikipedia"
                onPress={() => handleLinkPress(launch.links.wikipedia)}
              />
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// Lanjutan file yang sama...

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
  
  const LinkButton = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.linkButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color={COLORS.secondary} />
      <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      alignItems: 'center',
      padding: 20,
      backgroundColor: COLORS.surface,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    missionPatch: {
      width: 150,
      height: 150,
      marginBottom: 16,
    },
    missionName: {
      ...THEME.title,
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 8,
    },
    flightNumber: {
      ...THEME.text,
      color: COLORS.secondary,
      fontSize: 16,
    },
    statusSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 16,
    },
    section: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: COLORS.surface,
      borderRadius: 12,
      padding: 16,
    },
    lastSection: {
      marginBottom: 32,
    },
    sectionTitle: {
      ...THEME.subtitle,
      marginBottom: 16,
    },
    details: {
      ...THEME.text,
      lineHeight: 24,
    },
    timingInfo: {
      gap: 8,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    detailLabel: {
      ...THEME.text,
      color: COLORS.textSecondary,
      flex: 1,
    },
    detailValue: {
      ...THEME.text,
      flex: 2,
      textAlign: 'right',
    },
    coreCard: {
      backgroundColor: COLORS.surface + '40',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    coreTitle: {
      ...THEME.text,
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.secondary,
      marginBottom: 12,
    },
    coreStatusContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    coreStatusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    coreStatusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    coreDetails: {
      gap: 8,
    },
    landingStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: COLORS.surface,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
    },
    landingStat: {
      alignItems: 'center',
    },
    landingStatValue: {
      ...THEME.title,
      fontSize: 20,
      color: COLORS.secondary,
    },
    landingStatLabel: {
      ...THEME.text,
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    coreUpdate: {
      marginTop: 8,
      padding: 8,
      backgroundColor: COLORS.surface,
      borderRadius: 8,
    },
    coreUpdateText: {
      ...THEME.text,
      fontSize: 14,
      fontStyle: 'italic',
    },
    payloadCard: {
      backgroundColor: COLORS.surface + '40',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    payloadName: {
      ...THEME.text,
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.secondary,
      marginBottom: 12,
    },
    payloadDetails: {
      gap: 8,
    },
    orbitalParams: {
      marginTop: 8,
      padding: 12,
      backgroundColor: COLORS.surface,
      borderRadius: 8,
    },
    orbitalTitle: {
      ...THEME.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    launchpadCard: {
      backgroundColor: COLORS.surface + '40',
      borderRadius: 12,
      padding: 16,
    },
    launchpadName: {
      ...THEME.text,
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.secondary,
      marginBottom: 16,
    },
    launchpadStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: COLORS.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    launchpadStat: {
      alignItems: 'center',
    },
    galleryImage: {
      width: width - 64,
      height: (width - 64) * 0.75,
      borderRadius: 12,
      marginRight: 16,
    },
    linksGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    linkButton: {
      backgroundColor: COLORS.surface,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      flex: 1,
      minWidth: '45%',
      gap: 8,
    },
    linkText: {
      ...THEME.text,
      color: COLORS.secondary,
      fontSize: 14,
      fontWeight: '500',
    },
    statusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
    },
    statusText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
  
  export default LaunchDetailScreen;