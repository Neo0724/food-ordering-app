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
import useFood from '../custom-hook/useFood';

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

  /* Custom hook to fetch all foods */
  const {allFoods, isLoading, error} = useFood();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error || !allFoods) {
    return <Text>Error loading data.</Text>;
  }

  if (!isLoading && !error && allFoods.length === 0) {
    return <Text>No foods found.</Text>;
  }

  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error loading data.</Text>}
      {!isLoading && !error && allFoods.length === 0 && (
        <Text>No foods found.</Text>
      )}
      {!isLoading && !error && allFoods.length > 0 && (
        <FlatList
          data={allFoods}
          numColumns={2}
          style={styles.parentContainer}
          keyExtractor={food => food.itemId.toString()}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 10,
          }} // Space between columns and rows
          renderItem={({item: food}) => (
            <TouchableOpacity
              style={styles.foodContainer}
              onPress={() => navigation.navigate('FoodDetailPage', {food})}>
              <View style={styles.innerContent}>
                <Image
                  source={require('../../assets/img/friedchicken.jpeg')}
                  className="flex self-center w-[85%] mt-4"
                />
                <Text className="font-semibold text-xl ml-3 mt-1">
                  {food.itemName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
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
