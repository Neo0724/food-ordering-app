import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {sampleFoods} from '../sampleData/food';
import {FoodStackParamList} from './RootLayout';
import {FoodType} from '../sampleData/food';

export default function FoodPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FoodStackParamList>>();
  const [foods, setFoods] = useState<FoodType[] | undefined>(sampleFoods);
  return (
    <View>
      <FlatList
        data={foods}
        numColumns={2}
        style={styles.parentContainer}
        keyExtractor={food => food.id}
        renderItem={({item: food}) => (
          <TouchableOpacity
            style={styles.foodContainer}
            onPress={() => navigation.navigate('FoodDetailPage', {food})}>
            <Image
              source={require('../../assets/img/friedchicken.jpeg')}
              className="h-[80%]"
            />
            <Text className="mt-auto">{food.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    borderWidth: 1,
    margin: 7,
    gap: 20,
  },
  foodContainer: {
    borderWidth: 1,
    borderColor: 'red',
    width: '50%',
    height: 300,
  },
});
