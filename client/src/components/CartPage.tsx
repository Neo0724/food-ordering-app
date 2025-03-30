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
import {ShadowStyle} from '../../styles/ShadowStyle';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootLayout';
import {useState} from 'react';
import {useOrderContext} from '../context/OrderProvider';

export default function CartPage() {
  const {foodsInCart} = useCardContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
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
          isChecked,
          ...food
        }) => food,
      );

    if (filteredFood?.length === 0 || !filteredFood) {
      console.log('Cart cannot be empty');
      return;
    }
    // console.log(JSON.stringify(filteredFood, null, 2));
    addOrderMutation.mutate({ordersToAdd: filteredFood, totalPrice});
    // navigation.navigate('CheckoutStack', {
    //   screen: 'CheckoutPage',
    //   params: {totalPrice},
    // });
  };

  return (
    <View className="m-3 p-2 flex-col">
      {!foodsInCart?.length && <Text>Cart is empty...</Text>}
      <ScrollView className="h-[88%]">
        {foodsInCart?.map(food => (
          <EachCartItemPage
            food={food}
            key={food.cartId}
            setTotalPrice={setTotalPrice}
          />
        ))}
      </ScrollView>
      {/* The subtotal and proceed to checkout container */}
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
