import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useCardContext} from '../context/CartProvider';
import EachCartItemPage from './EachCartItemPage';

export default function CartPage() {
  const {foodsInCart, totalPrice} = useCardContext();
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
    <View className="m-3 p-2">
      {!foodsInCart?.length && <Text>Cart is empty...</Text>}
      <ScrollView className="h-[90%]">
        {foodsInCart.map(food => (
          <EachCartItemPage food={food} />
        ))}
      </ScrollView>
      {/* The subtotal and proceed to checkout */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-2xl">Subtotal</Text>
        <Text className="text-2xl">{totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
}
