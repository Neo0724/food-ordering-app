import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import React from 'react';
import {usePointAndCredit} from '../../context/PointAndCreditProvider';
import CanteedCard from './CanteedCard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OwnCardStackParamList} from '../../navigation/OwnCardStack';

const OwnCardPage = () => {
  const {isLoading, error, topUpCredit} = usePointAndCredit();

  const navigate =
    useNavigation<NativeStackNavigationProp<OwnCardStackParamList>>();

  return (
    <View className="flex-1 p-4 bg-white">
      {isLoading && (
        <View className="flex-1 justify-center items-center gap-y-2">
          <Text className="text-lg font-medium text-gray-600">
            Loading contents ...
          </Text>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}

      {error && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-medium text-red-500">
            Error loading contents ...
          </Text>
        </View>
      )}

      {!isLoading && !error && (
        <View className="flex-1 justify-center items-center gap-y-8">
          {/* Lock card height */}
          <View style={{width: '100%', maxWidth: 340}}>
            <CanteedCard />
          </View>

          <TouchableOpacity
            onPress={() =>
              navigate.navigate('TopUpCardPage', {
                topUpCredit,
              })
            }
            className="bg-blue-600 px-6 py-3 rounded-full shadow-md">
            <Text className="text-white text-center font-bold">Top Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OwnCardPage;
