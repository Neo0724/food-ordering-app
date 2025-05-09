/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import useFood, {Food} from '../custom-hook/useFood';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../navigation/BottomTab';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const {allFoods, isLoading, error} = useFood();
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();

  const handleNavigateFood = (food: Food) => {
    navigation.navigate('FoodPage', {
      screen: 'EachFoodPage',
      params: {food},
      initial: false,
    });
  };

  return (
    <View style={styles.parentContainer}>
      {isLoading && (
        /* Loading indicator */
        <View className="my-auto gap-y-2 justify-center items-center">
          <Text className="text-lg font-medium text-gray-600">
            Loading contents ...
          </Text>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
      {error && (
        <Text className="text-lg font-medium text-gray-600">
          Error loading contents ...
        </Text>
      )}
      {!isLoading && !error && allFoods && allFoods.length > 0 && (
        <>
          <PagerView
            style={styles.foodPagerView}
            initialPage={0}
            onPageSelected={e => setCurrentPage(e.nativeEvent.position)}>
            {allFoods?.map(food => (
              <View key={food.itemId} style={styles.eachPagerPage}>
                <TouchableOpacity
                  style={styles.foodImageContainer}
                  onPress={() => handleNavigateFood(food)}>
                  <Image
                    source={{
                      uri: `https://res.cloudinary.com/dnhcz4fi7/image/upload/v1746775641/${food.itemName}`,
                    }}
                    style={styles.foodImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View style={styles.foodDetailsContainer}>
                  <Text style={styles.foodName}>{food.itemName}</Text>
                  <Text style={styles.foodDescription} numberOfLines={2}>
                    {food.itemDescription}
                  </Text>
                </View>
              </View>
            ))}
          </PagerView>
          <View style={styles.dotContainer}>
            {allFoods?.map((food, index) => (
              <View
                key={food.itemId}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentPage === index ? 'black' : 'rgba(0, 0, 0, 0.3)',
                  },
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  foodPagerView: {
    flex: 1,
  },
  eachPagerPage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 570,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodDetailsContainer: {
    width: '100%',
    padding: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodDescription: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.7)',
    lineHeight: 24,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  foodImageContainer: {
    marginTop: -70,
    width: '100%',
    height: '70%',
  },
});
