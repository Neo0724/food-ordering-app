/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCardContext} from '../context/CartProvider';
import EachCartItemPage from './EachCartItemPage';
import {ButtonStyle} from '../../styles/ButtonStyles';
import {useOrderContext} from '../context/OrderProvider';

export default function CartPage() {
  const {foodsInCart, totalPrice} = useCardContext();
  const {addOrderMutation} = useOrderContext();

  const handleCheckout = () => {
    const filteredFood = foodsInCart?.map(
      ({
        createTime,
        updateTime,
        availableQuantity,
        itemName,
        price,
        size,
        status,
        ...food
      }) => {
        return food;
      },
    );

    if (!filteredFood) {
      console.log('Cart cannot be empty');
      return;
    }
    addOrderMutation.mutate(filteredFood);
  };

  return (
    <View className="m-3 p-2">
      {!foodsInCart?.length && <Text>Cart is empty...</Text>}
      <ScrollView className="h-[85%]">
        {foodsInCart?.map(food => (
          <EachCartItemPage food={food} key={food.sizeId} />
        ))}
      </ScrollView>
      {/* The subtotal and proceed to checkout */}
      <View className="flex-col gap-2  mt-5 bg-blue">
        <View className="flex-row justify-between">
          <Text className="text-2xl">Subtotal</Text>
          <Text className="text-2xl">{totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={ButtonStyle.generalButton}
          onPress={handleCheckout}>
          <Text style={ButtonStyle.generalButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
