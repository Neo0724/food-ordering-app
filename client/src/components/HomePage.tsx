import React from 'react';
import {Text, View} from 'react-native';
import {useAuthContext} from '../context/AuthProvider';

export default function HomePage() {
  const {user} = useAuthContext();

  return (
    <View>
      <Text>Home page</Text>
      <Text>Welcome {user?.displayName}</Text>
    </View>
  );
}
