/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootLayout';
import {useState} from 'react';
import CustomDialog from '../CustomDialog';

export default function CartPage() {
  const {foodsInCart} = useCartContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

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
      setDialogTitle('None is selected');
      setDialogMessage('Please select some foods to checkout');
      setVisible(true);
      return;
    }
    // addOrderMutation.mutate({
    //   ordersToAdd: filteredFood,
    //   totalPrice,
    //   setDialogMessage,
    //   setDialogTitle,
    //   setVisible,
    // });
    navigation.navigate('CheckoutStack', {
      screen: 'CheckoutPage',
      params: {totalPrice},
    });
  };

  return (
    <View className="m-3 p-2 flex-col mb-10">
      <CustomDialog
        title={dialogTitle}
        message={dialogMessage}
        visible={visible}
        setVisible={setVisible}
      />
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
