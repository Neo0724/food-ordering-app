/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import useFood from '../custom-hook/useFood';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const {allFoods, isLoading, error} = useFood();

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
                <Image
                  source={require('../../assets/img/friedchicken.jpeg')}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
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
    height: 600,
  },
  foodImage: {
    width: '100%',
    height: '85%',
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
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
