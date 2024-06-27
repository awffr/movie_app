import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeProps = {
  navigation: StackNavigationProp<any>; 
};

const Home = ({ navigation }: HomeProps): JSX.Element => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home Screen</Text>
    <Button
      title="Go to Movie Detail"
      onPress={() => navigation.navigate('MovieDetail')}
    />
  </View>
);

export default Home;
