import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Food} from '../../custom-hook/useFood';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodStackParamList} from '../../navigation/FoodStack';

type EachFoodMenuPageProps = {
  food: Food;
};

const EachFoodMenuPage = ({food}: EachFoodMenuPageProps) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<FoodStackParamList, 'FoodListPage'>
    >();
  return (
    <TouchableOpacity
      style={styles.foodContainer}
      onPress={() => navigation.navigate('EachFoodPage', {food})}
      activeOpacity={0.7}>
      <View style={styles.innerContent}>
        {/* Food image */}
        <Image
          source={{
            uri: `https://res.cloudinary.com/dnhcz4fi7/image/upload/v1746775641/${food.itemName}`,
          }}
          style={styles.foodImage}
        />
        {/* Food name and description */}
        <View className="p-3 flex-1">
          {/* Food name */}
          <Text className="font-bold text-[16px] text-gray-800">
            {food.itemName}
          </Text>
          {/* Food description */}
          <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
            {food.itemDescription}
          </Text>
          {/* Food price */}
          <Text className="text-sm font-medium text-orange-500 mt-5">
            From RM {Math.min(...food.list.map(v => v.price)).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  foodContainer: {
    height: 300,
    width: '50%',
    padding: 8,
  },
  innerContent: {
    ...ShadowStyle.shadowBox,
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
});

export default EachFoodMenuPage;
