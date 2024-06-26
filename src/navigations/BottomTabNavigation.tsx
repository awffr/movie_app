import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Favorite from '../screens/Favorite';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (): JSX.Element => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color }: { color: string }) => (
          <Feather name="home" size={28} color={color} />
        ),
        headerShown: false,
      } as BottomTabNavigationOptions}
    />
    <Tab.Screen
      name="Search"
      component={Search}
      options={{
        tabBarIcon: ({ color }: { color: string }) => (
          <Feather name="search" size={28} color={color} />
        ),
        headerShown: false,
      } as BottomTabNavigationOptions}
    />
    <Tab.Screen
      name="Favorite"
      component={Favorite}
      options={{
        tabBarIcon: ({ color }: { color: string }) => (
          <Feather name="heart" size={28} color={color} />
        ),
        headerShown: false,
      } as BottomTabNavigationOptions}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
