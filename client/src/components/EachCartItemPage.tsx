import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {FoodCartType, useCardContext} from '../context/CartProvider';
import useQuantityDebounce from '../custom-hook/quantityDebounce';

type EachCartItemProp = {
  food: FoodCartType;
};

export default function EachCartItemPage({food}: EachCartItemProp) {
  const {removeFromCart, updateQuantity} = useCardContext();
  const [exceedQuantity, setExceedQuantity] = useState<boolean>(false);
  const debouncedQuantity = useQuantityDebounce(food.selectedQuantity, 1500);

  return (
    <View
      key={food.selectedVariant.sizeId}
      className="pb-5 gap-3 border-b-2 border-b-gray-300">
      <View className="flex-row justify-between">
        <Text className="text-2xl">{food.itemName}</Text>
        <Text className="font-bold text-xl">
          RM {food.selectedVariant.price}
        </Text>
      </View>
      <Text className="text-xl">Size: {food.selectedVariant.size}</Text>
      <View className="flex-row gap-3">
        <Text>Quantity:</Text>
        <TouchableOpacity
          className="w-7 bg-red-400 h-7 items-center justify-center"
          onPress={() =>
            updateQuantity(
              food.itemId,
              'DECREMENT',
              food.selectedVariant.sizeId,
              setExceedQuantity,
            )
          }>
          <Text className="text-white font-bold">-</Text>
        </TouchableOpacity>
        <Text>{food.selectedQuantity}</Text>
        <TouchableOpacity
          className="w-7 bg-blue-400 h-7 items-center justify-center"
          onPress={() =>
            updateQuantity(
              food.itemId,
              'INCREMENT',
              food.selectedVariant.sizeId,
              setExceedQuantity,
            )
          }>
          <Text text-white font-bold>
            +
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Remove"
        onPress={() => removeFromCart(food.itemId, food.selectedVariant.sizeId)}
      />
      {/* Error message then user selects over the max quantity */}
      {exceedQuantity && (
        <Text className="font-bold text-red-500 text-center">
          You have reached the maximum quantity
        </Text>
      )}
      <Text>{debouncedQuantity}</Text>
    </View>
  );
}
