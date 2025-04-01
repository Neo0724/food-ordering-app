import {View, Text, Button} from 'react-native';
import React from 'react';
import {CheckoutStackParamList} from '../../navigation/CheckoutStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const TopUpPage = ({
  navigation,
  route,
}: NativeStackScreenProps<CheckoutStackParamList, 'TopUpPage'>) => {
  return (
    <View>
      <Text>TopUpPage</Text>
    </View>
  );
};

export default TopUpPage;
