import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeStackNavigation from './HomeStackNavigation';
import Search from '../screens/Search';
import Favorite from '../screens/Favorite';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (): JSX.Element => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#D32F2F', 
      tabBarInactiveTintColor: 'gray', 
      tabBarStyle: {
        backgroundColor: 'white', 
      },
      headerShown: false, 
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStackNavigation}
      options={{
        tabBarIcon: ({ color }: { color: string }) => (
          <Feather name="home" size={28} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={Search}
      options={{
        tabBarIcon: ({ color }: { color: string }) => (
          <Feather name="search" size={28} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Favorite"
      component={Favorite}
      options={{
        tabBarIcon: ({ color }: { color: string }) => (
          <Feather name="heart" size={28} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
