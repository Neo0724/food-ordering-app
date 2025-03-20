import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FoodStackParamList} from './RootLayout';
import useSWR from 'swr';
import axios from 'axios';
import Config from 'react-native-config';

export type Variant = {
  sizeId: number;
  size: string;
  price: number;
  onSale: number;
  quantity: number;
};

export type Food = {
  itemId: number;
  itemName: string;
  itemDescription: string;
  ingredient: string;
  list: Variant[];
};

export default function FoodPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FoodStackParamList>>();

  const fetcher = async (url: string) => {
    const response = await axios.get(url);

    if (response.data.code === 1 && response.data.msg === 'success') {
      return response.data.data;
    }
  };

  const {
    data: allFoods,
    isLoading,
    error,
  } = useSWR<Food[]>(`http://${Config.BACKEND_URL}/inventorys`, fetcher);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error || !allFoods) {
    return <Text>Error loading data.</Text>;
  }

  return (
    <View>
      <FlatList
        data={allFoods}
        numColumns={2}
        style={styles.parentContainer}
        keyExtractor={food => food.itemId.toString()}
        columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 10}} // Space between columns and rows
        renderItem={({item: food}) => (
          <TouchableOpacity
            style={styles.foodContainer}
            onPress={() => navigation.navigate('FoodDetailPage', {food})}>
            <View style={styles.innerContent}>
              <Image
                source={require('../../assets/img/friedchicken.jpeg')}
                className="flex self-center w-[85%] mt-4"
              />
              <Text className="font-semibold text-xl">{food.itemName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    borderWidth: 1,
    backgroundColor: 'lightgray',
  },
  foodContainer: {
    height: 275,
    width: '50%',
    padding: 7,
  },

  innerContent: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
  },
});
