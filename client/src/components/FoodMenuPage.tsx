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
import useFood from '../custom-hook/useFood';
import {ShadowStyle} from '../../styles/ShadowStyle';
import {FoodStackParamList} from '../navigation/FoodStack';
import {Searchbar} from 'react-native-paper';
import {SearchBarStyles} from '../../styles/SearchBarStyles';
import {useSearchFoodContext} from '../context/SearchFoodProvider';
// import debounce from '../../utils/debounce';
// import {useQueryClient} from '@tanstack/react-query';

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

  const {searchFoodName, setSearchFoodName} = useSearchFoodContext();

  // const debounceSearchFoodName = useMemo(
  //   () =>
  //     debounce((newFoodName: string) => {
  //       queryClient.setQueryData(['foods'], (old: any)
  // => {
  //         return old.filter((food: any) =>
  //           food.itemName.toLowerCase().includes
  // (newFoodName.toLowerCase()),
  //         );
  //       });
  //     }, 500),
  //   // eslint-disable-next-line react-hooks/
  // exhaustive-deps
  //   [],
  // );

  /* Custom hook to fetch all foods */
  const {allFoods, isLoading, error} = useFood();

  return (
    <View className="flex-1">
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
          <Searchbar
            style={[ShadowStyle.shadowBox, SearchBarStyles.searchBar]}
            placeholder="Search for your favorite food..."
            iconColor="white"
            cursorColor="white"
            placeholderTextColor="rgba(255,255,255,0.8)"
            inputStyle={{color: 'white', fontSize: 16}}
            value={searchFoodName}
            onPress={() => navigation.navigate('SearchFoodScreen')}
            onClearIconPress={() => setSearchFoodName('')}
          />
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
                    source={require('../../assets/img/friedchicken.jpeg')}
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
