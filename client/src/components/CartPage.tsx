import React, {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {useCardContext} from '../context/CartProvider';

export default function CartPage() {
  const {foodsInCart, addToCart, removeFromCart, updateQuantity} =
    useCardContext();
  const [exceedQuantity, setExceedQuantity] = useState<boolean>(false);

  useEffect(() => {
    if (exceedQuantity) {
      const exceedQuantityTimeout = setTimeout(() => {
        setExceedQuantity(false);
      }, 2000);

      return () => clearTimeout(exceedQuantityTimeout);
    }
  }, [exceedQuantity]);
  return (
    <View>
      {!foodsInCart?.length && <Text>Cart is empty...</Text>}
      {foodsInCart.map(food => (
        <View key={food.id + food.price.toString()}>
          <Text>{food.name}</Text>
          <Text>Size: {food.size}</Text>
          <Text>Price: {food.price}</Text>
          <Button
            title="Remove"
            onPress={() => removeFromCart(food.id, food.size)}
          />
          <View className="flex-row gap-3">
            <Text>Quantity:</Text>
            <TouchableOpacity
              className="w-7 bg-red-400 h-7 items-center justify-center"
              onPress={() =>
                updateQuantity(
                  food.id,
                  'DECREMENT',
                  food.size,
                  setExceedQuantity,
                )
              }>
              <Text className="text-white font-bold">-</Text>
            </TouchableOpacity>
            <Text>{food.quantity}</Text>
            <TouchableOpacity
              className="w-7 bg-blue-400 h-7 items-center justify-center"
              onPress={() =>
                updateQuantity(
                  food.id,
                  'INCREMENT',
                  food.size,
                  setExceedQuantity,
                )
              }>
              <Text text-white font-bold>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {exceedQuantity && (
        <Text className="font-bold text-red-500 text-center">
          You have reached the maximum quantity
        </Text>
      )}
    </View>
  );
}
