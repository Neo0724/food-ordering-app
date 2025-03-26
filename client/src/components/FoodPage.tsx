import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useState} from 'react';
import {
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

  const [searchFoodName, setSearchFoodName] = useState<string>('');

  // const debounceSearchFoodName = useMemo(
  //   () =>
  //     debounce((newFoodName: string) => {
  //       queryClient.setQueryData(['foods'], (old: any) => {
  //         return old.filter((food: any) =>
  //           food.itemName.toLowerCase().includes(newFoodName.toLowerCase()),
  //         );
  //       });
  //     }, 500),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [],
  // );

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
        <View>
          <Searchbar
            style={[styles.searchBar]}
            placeholder="Search"
            iconColor="white"
            cursorColor="white"
            placeholderTextColor="white"
            inputStyle={{color: 'white'}}
            value={searchFoodName}
            onChangeText={text => {
              // debounceSearchFoodName(text);
              setSearchFoodName(text);
            }}
          />
          <FlatList
            data={allFoods}
            numColumns={2}
            keyExtractor={food => food.itemId.toString()}
            // eslint-disable-next-line react-native/no-inline-styles
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            contentContainerStyle={{
              paddingBottom: 160,
            }}
            renderItem={({item: food}: {item: Food}) => (
              <TouchableOpacity
                style={styles.foodContainer}
                onPress={() => navigation.navigate('EachFoodPage', {food})}>
                <View style={styles.innerContent}>
                  <Image
                    source={require('../../assets/img/friedchicken.jpeg')}
                    className="flex self-center w-full rounded-t-lg"
                  />
                  <Text className="font-semibold text-[1.1rem] ml-3 mt-1">
                    {food.itemName}
                  </Text>
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
    height: 275,
    width: '50%',
    padding: 7,
  },

  innerContent: {
    ...ShadowStyle.shadowBox,
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
  },
  searchBar: {
    margin: 10,
    backgroundColor: 'rgb(238,200,10)',
  },
});
