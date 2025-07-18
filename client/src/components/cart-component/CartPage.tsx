import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCartContext} from '../../context/CartProvider';
import EachCartItemPage from './EachCartItemPage';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {useCustomDialog} from '../../context/CustomDialogContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootLayout';

export default function CartPage() {
  const {foodsInCart, totalPrice, checkedCart, setTotalPrice, setCheckedCart} =
    useCartContext();

  /* Custom dialog function */
  const {showDialog} = useCustomDialog();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCheckout = () => {
    if (checkedCart.size === 0) {
      showDialog('None is selected', 'Please select some foods to checkout');
      return;
    }
    // const filteredFood = foodsInCart
    //   ?.filter(food => food.isChecked)
    //   .map(
    //     ({
    //       createTime,
    //       updateTime,
    //       availableQuantity,
    //       itemName,
    //       price,
    //       size,
    //       status,
    //       isChecked,
    //       ...food
    //     }) => food,
    //   );

    // if (filteredFood?.length === 0 || !filteredFood) {
    // }

    navigation.navigate('CheckoutStack', {
      screen: 'CheckoutPage',
      params: {totalPrice},
    });
  };

  useEffect(() => {
    setTotalPrice(0);
    setCheckedCart(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="m-3 p-2 flex-col mb-10">
      {!foodsInCart?.length && <Text>Cart is empty...</Text>}
      <ScrollView className="h-[88%]">
        {foodsInCart?.map(food => (
          <EachCartItemPage food={food} key={food.cartId} />
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
