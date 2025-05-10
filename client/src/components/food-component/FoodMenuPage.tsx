import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {SearchBarStyles} from '../../../styles/SearchBarStyles';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {useSearchFoodContext} from '../../context/SearchFoodProvider';
import useFood, {Food} from '../../custom-hook/useFood';
import {FoodStackParamList} from '../../navigation/FoodStack';
import EachFoodMenuPage from './EachFoodMenuPage';

export type Variant = {
  sizeId: number;
  size: string;
  price: number;
  onSale: number;
  quantity: number;
};

export default function FoodMenuPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FoodStackParamList>>();

  const {searchFoodName, setSearchFoodName} = useSearchFoodContext();

  /* Custom hook to fetch all foods */
  const {allFoods, isLoading, error} = useFood();

  return (
    <View className="flex-1">
      <Searchbar
        style={[ShadowStyle.shadowBox, SearchBarStyles.searchBar]}
        placeholder="Search for your favorite food..."
        iconColor="white"
        cursorColor="white"
        placeholderTextColor="rgba(254,255,255,0.8)"
        inputStyle={{color: 'white', fontSize: 15}}
        value={searchFoodName}
        onPress={() => navigation.navigate('SearchFoodScreen')}
        onClearIconPress={() => setSearchFoodName('')}
      />
      {isLoading && (
        /* Loading indicator */
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-medium text-gray-600">
            Loading contents...
          </Text>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
      {error && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-medium text-red-500">
            Error loading foods.
          </Text>
        </View>
      )}
      {!isLoading && !error && allFoods && allFoods.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-medium text-gray-600">
            No foods found.
          </Text>
        </View>
      )}
      {!isLoading && !error && allFoods && allFoods.length > 0 && (
        <View className="flex-1">
          <FlatList
            data={allFoods}
            numColumns={2}
            keyExtractor={food => food.itemId.toString()}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.flatListContent}
            renderItem={({item: food}: {item: Food}) => (
              <EachFoodMenuPage food={food} />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
  },
  flatListContent: {
    paddingHorizontal: 4,
    paddingBottom: 30,
  },
});
