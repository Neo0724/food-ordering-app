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
import {ShadowStyle} from '../../styles/ShadowStyle';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootLayout';

export default function CartPage() {
  const {foodsInCart, totalPrice} = useCardContext();
  const {addOrderMutation} = useOrderContext();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCheckout = () => {
    const filteredFood = foodsInCart
      ?.filter(food => food.isChecked)
      .map(
        ({
          createTime,
          updateTime,
          availableQuantity,
          itemName,
          price,
          size,
          status,
          ...food
        }) => food,
      );

    if (filteredFood?.length === 0) {
      console.log('Cart cannot be empty');
      return;
    }
    console.log(filteredFood);
    // addOrderMutation.mutate(filteredFood);
    // navigation.navigate('CheckoutStack');
  };

  return (
    <View className="m-3 p-2 flex-col">
      {!foodsInCart?.length && <Text>Cart is empty...</Text>}
      <ScrollView className="h-[88%]">
        {foodsInCart?.map(food => (
          <EachCartItemPage food={food} key={food.cartId} />
        ))}
      </ScrollView>
      {/* The subtotal and proceed to checkout */}
      <View style={styles.subTotalAndCheckoutContainer}>
        <View className="flex-col justify-between flex-2">
          <Text className="text-xl">Subtotal</Text>
          <Text className="text-2xl font-bold">RM {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[ButtonStyle.generalButton, styles.checkoutButton]}
          onPress={handleCheckout}>
          <Text style={ButtonStyle.generalButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkoutButton: {
    flex: 1,
  },
  subTotalAndCheckoutContainer: {
    ...ShadowStyle.shadowBox,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '12%',
    marginTop: 10,
    gap: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});
