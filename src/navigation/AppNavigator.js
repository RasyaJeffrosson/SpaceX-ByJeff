// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Pastikan menginstall @expo/vector-icons
import { COLORS } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import RocketsScreen from '../screens/RocketsScreen';
import LaunchesScreen from '../screens/LaunchesScreen';
import RoadsterScreen from '../screens/RoadsterScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
  },
  headerTintColor: COLORS.text,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  tabBarStyle: {
    backgroundColor: COLORS.primary,
    borderTopColor: COLORS.surface,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarActiveTintColor: COLORS.secondary,
  tabBarInactiveTintColor: COLORS.textSecondary,
};

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'SpaceX-ByJeff',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Rockets" 
        component={RocketsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="rocket" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Launches" 
        component={LaunchesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="send" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Roadster" 
        component={RoadsterScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;