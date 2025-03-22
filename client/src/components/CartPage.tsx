import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useCardContext} from '../context/CartProvider';
import EachCartItemPage from './EachCartItemPage';
import {ButtonStyle} from '../../styles/ButtonStyles';

export default function CartPage() {
  const {foodsInCart, totalPrice} = useCardContext();
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
        <TouchableOpacity style={ButtonStyle.generalButton}>
          <Text style={ButtonStyle.generalButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
