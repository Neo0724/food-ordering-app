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

export type Variant = {
  sizeId: number;
  size: string;
  price: number;
  onSale: number;
  quantity: number;
};

export default function FoodPage() {
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
                    <Text
                      className="text-sm text-gray-500 mt-1"
                      numberOfLines={2}>
                      {food.itemDescription}
                    </Text>
                    {/* Food price */}
                    <Text className="text-sm font-medium text-orange-500 mt-5">
                      From RM{' '}
                      {Math.min(...food.list.map(v => v.price)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  foodContainer: {
    height: 300,
    width: '50%',
    padding: 8,
  },
  innerContent: {
    ...ShadowStyle.shadowBox,
    // boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  flatListContent: {
    paddingHorizontal: 4,
    paddingBottom: 30,
  },
});
