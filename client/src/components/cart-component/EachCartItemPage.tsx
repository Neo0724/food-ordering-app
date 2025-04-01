import React, {SetStateAction, useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  RetrievedFoodCartType,
  useCartContext,
} from '../../context/CartProvider';
import debounce from '../../../utils/debounce';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {Checkbox} from 'react-native-paper';

type EachCartItemProp = {
  food: RetrievedFoodCartType;
  setTotalPrice: React.Dispatch<SetStateAction<number>>;
};

export default function EachCartItemPage({
  food,
  setTotalPrice,
}: EachCartItemProp) {
  const {removeFromCartMutation, updateCartQuantityMutation, checkFoodInCart} =
    useCartContext();
  const [exceedQuantity, setExceedQuantity] = useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    food.quantity,
  );
  const [checked, setChecked] = useState<boolean>(food.isChecked);
  const debounceQuantityUpdate = useMemo(
    () =>
      debounce((params: {cartId: number; newQuantity: number}) => {
        updateCartQuantityMutation.mutate(params);
      }, 450),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleDecreaseQuantity = () => {
    /* Reset error message when user start changing quantity */
    setExceedQuantity(false);

    /* Current quantity is 1 */
    if (selectedQuantity === 1) {
      setExceedQuantity(true);
      return;
    }
    checked && setTotalPrice(prev => Math.abs(prev - food.price));
    setSelectedQuantity(prev => {
      debounceQuantityUpdate({
        cartId: food.cartId,
        newQuantity: prev - 1,
      });

      return prev - 1;
    });
  };

  const handleIncreaseQuantity = () => {
    /* Reset error message when user start changing quantity */
    setExceedQuantity(false);
    /* Quantity exceed the available quantity */
    if (selectedQuantity + 1 > food.availableQuantity) {
      setExceedQuantity(true);
      return;
    }
    checked && setTotalPrice(prev => prev + food.price);
    setSelectedQuantity(prev => {
      debounceQuantityUpdate({
        cartId: food.cartId,
        newQuantity: prev + 1,
      });

      return prev + 1;
    });
  };

  useEffect(() => {
    setSelectedQuantity(food.quantity);
  }, [food.quantity]);

  useEffect(() => {
    if (exceedQuantity) {
      const errorTimeout = setTimeout(() => {
        setExceedQuantity(false);
      }, 2500);

      return () => clearTimeout(errorTimeout);
    }
  }, [exceedQuantity]);

  return (
    <View className="flex-row justify-center items-center">
      <View className="w-[10%]">
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            if (checked) {
              setTotalPrice(prev =>
                Math.abs(prev - food.price * selectedQuantity),
              );
            } else {
              setTotalPrice(prev =>
                Math.abs(prev + food.price * selectedQuantity),
              );
            }
            checkFoodInCart(food.cartId);
            setChecked(prev => !prev);
          }}
        />
      </View>
      <View
        key={food.sizeId}
        style={[styles.eachCartItemContainer, ShadowStyle.shadowBox]}>
        <View className="flex-row justify-between">
          <Text className="text-2xl">{food.itemName}</Text>
          <Text className="font-bold text-xl">RM {food.price}</Text>
        </View>
        <Text className="text-xl">Size: {food.size}</Text>
        <View className="flex-row gap-3">
          <Text>Quantity:</Text>
          <TouchableOpacity
            style={ButtonStyle.plusMinusButton}
            onPress={handleDecreaseQuantity}>
            <Text style={ButtonStyle.plusMinusText}>-</Text>
          </TouchableOpacity>
          <Text>{selectedQuantity}</Text>
          <TouchableOpacity
            style={ButtonStyle.plusMinusButton}
            onPress={handleIncreaseQuantity}>
            <Text style={ButtonStyle.plusMinusText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            checked &&
              setTotalPrice(prev =>
                Math.abs(prev - food.price * food.quantity),
              );
            removeFromCartMutation.mutate({
              cartId: food.cartId,
              unitPrice: food.price,
              prevQuantity: food.quantity,
              isChecked: checked,
              setTotalPrice,
            });
          }}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
        {/* Error message then user selects over the max quantity */}
        {exceedQuantity && (
          <Text className="font-bold text-red-500 text-center">
            You have reached the maximum quantity
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eachCartItemContainer: {
    gap: 10,
    borderRadius: 9,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 6,
    flex: 1,
  },
  removeButton: {
    backgroundColor: 'rgb(255,131,131)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignSelf: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
