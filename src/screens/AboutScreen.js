// src/screens/AboutScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet,
  Dimensions,
  Linking
} from 'react-native';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

const { width } = Dimensions.get('window');
const PROFILE_SIZE = width * 0.4;

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={require('../../assets/profile-picture.jpg')} // Make sure to add your profile picture to assets folder
              style={styles.profileImage}
            />
            <View style={styles.profileGlow} />
          </View>
          
          <Text style={styles.name}>Your Name</Text>
          <Text style={styles.subtitle}>Student ID: Your Student ID</Text>
          <Text style={styles.subtitle}>Computer Science Department</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About SpaceX-Info</Text>
          <Text style={styles.description}>
            SpaceX-Info is a mobile application designed to provide comprehensive 
            information about SpaceX's activities, rockets, launches, and space 
            exploration endeavors. This app was developed as part of a project to 
            demonstrate mobile application development skills using React Native 
            and integration with external APIs.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <FeatureItem title="Company Info" description="Get detailed information about SpaceX" />
            <FeatureItem title="Rockets" description="Explore SpaceX's rocket fleet" />
            <FeatureItem title="Launches" description="Track past and upcoming missions" />
            <FeatureItem title="Roadster" description="Follow Starman's journey through space" />
            <FeatureItem title="History" description="Discover key events in SpaceX's timeline" />
          </View>
        </View>

        <View style={[styles.card, styles.lastCard]}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <View style={styles.techList}>
            <TechItem name="React Native" />
            <TechItem name="Expo" />
            <TechItem name="SpaceX API" />
            <TechItem name="React Navigation" />
            <TechItem name="Axios" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const FeatureItem = ({ title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureTitle}>• {title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const TechItem = ({ name }) => (
  <View style={styles.techItem}>
    <Text style={styles.techText}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...THEME.container,
  },
  content: {
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  profileGlow: {
    position: 'absolute',
    width: PROFILE_SIZE + 10,
    height: PROFILE_SIZE + 10,
    borderRadius: (PROFILE_SIZE + 10) / 2,
    backgroundColor: COLORS.secondary + '20',
    top: -5,
    left: -5,
    zIndex: -1,
  },
  name: {
    ...THEME.title,
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    ...THEME.text,
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 4,
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
    marginBottom: 16,
  },
  description: {
    ...THEME.text,
    lineHeight: 24,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    gap: 4,
  },
  featureTitle: {
    ...THEME.text,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  featureDescription: {
    ...THEME.text,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 16,
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techItem: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  techText: {
    ...THEME.text,
    fontSize: 14,
    color: COLORS.secondary,
  },
});