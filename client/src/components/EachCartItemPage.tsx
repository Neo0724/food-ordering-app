import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, Button, StyleSheet} from 'react-native';
import {RetrievedFoodCartType, useCardContext} from '../context/CartProvider';
import debounce from '../../utils/debounce';

type EachCartItemProp = {
  food: RetrievedFoodCartType;
};

export default function EachCartItemPage({food}: EachCartItemProp) {
  const {removeFromCartMutation, updateCartQuantityMutation, setTotalPrice} =
    useCardContext();
  const [exceedQuantity, setExceedQuantity] = useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    food.quantity,
  );

  useEffect(() => {
    setSelectedQuantity(food.quantity);
  }, [food.quantity]);

  const debounceQuantityUpdate = useMemo(
    () =>
      debounce(
        (params: {
          cartId: number;
          unitPrice: number;
          prevQuantity: number;
          newQuantity: number;
        }) => {
          updateCartQuantityMutation.mutate(params);
        },
        450,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (exceedQuantity) {
      const errorTimeout = setTimeout(() => {
        setExceedQuantity(false);
      }, 2500);

      return () => clearTimeout(errorTimeout);
    }
  }, [exceedQuantity]);

  return (
    <View key={food.sizeId} className="pb-5 gap-3 border-b-2 border-b-gray-300">
      <View className="flex-row justify-between">
        <Text className="text-2xl">{food.itemName}</Text>
        <Text className="font-bold text-xl">RM {food.price}</Text>
      </View>
      <Text className="text-xl">Size: {food.size}</Text>
      <View className="flex-row gap-3">
        <Text>Quantity:</Text>
        <TouchableOpacity
          style={styles.plusMinusButton}
          onPress={() => {
            /* Reset error message when user start changing quantity */
            setExceedQuantity(false);
            if (selectedQuantity === 1) {
              setExceedQuantity(true);
              return;
            }
            setTotalPrice(prev => Math.abs(prev - food.price));
            setSelectedQuantity(prev => {
              debounceQuantityUpdate({
                cartId: food.cartId,
                newQuantity: prev - 1,
                prevQuantity: prev,
                unitPrice: food.price,
              });

              return prev - 1;
            });
          }}>
          <Text style={styles.plusMinusText}>-</Text>
        </TouchableOpacity>
        <Text>{selectedQuantity}</Text>
        <TouchableOpacity
          style={styles.plusMinusButton}
          onPress={() => {
            /* Reset error message when user start changing quantity */
            setExceedQuantity(false);
            if (selectedQuantity + 1 > food.availableQuantity) {
              setExceedQuantity(true);
              return;
            }
            setTotalPrice(prev => prev + food.price);
            setSelectedQuantity(prev => {
              debounceQuantityUpdate({
                cartId: food.cartId,
                newQuantity: prev + 1,
                prevQuantity: prev,
                unitPrice: food.price,
              });

              return prev + 1;
            });
          }}>
          <Text style={styles.plusMinusText}>+</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Remove"
        onPress={() =>
          removeFromCartMutation.mutate({
            cartId: food.cartId,
            prevQuantity: food.quantity,
            unitPrice: food.price,
          })
        }
      />
      {/* Error message then user selects over the max quantity */}
      {exceedQuantity && (
        <Text className="font-bold text-red-500 text-center">
          You have reached the maximum quantity
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  plusMinusButton: {
    borderRadius: 10,
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  plusMinusText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
