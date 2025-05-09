/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {CheckoutStackParamList} from '../../navigation/CheckoutStack';
import {usePointAndCredit} from '../../context/PointAndCreditProvider';
import auth from '@react-native-firebase/auth';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {useOrderContext} from '../../context/OrderProvider';
import {useCartContext} from '../../context/CartProvider';
import {useNavigation} from '@react-navigation/native';
import DebitCartInputPage from './DebitCartInputPage';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {debitCardSchemaWithTopUp} from './schemas/debit-cart-schema';
import {useCustomDialog} from '../../context/CustomDialogContext';
import {saveTransactionHistory} from '../../../utils/file-system';
import CanteedCard from '../own-card-component/CanteedCard';
import {RootStackParamList} from '../../navigation/RootLayout';

const PayWithAccountCreditPage = ({
  route,
}: NativeStackScreenProps<
  CheckoutStackParamList,
  'PayWithAccountCreditPage'
>) => {
  const totalPrice = route.params.totalPrice;
  const {creditBalance, topUpCredit} = usePointAndCredit();
  let sufficientCredit = creditBalance >= totalPrice;
  const accountHolderName = auth().currentUser?.displayName;
  const {addOrderMutation} = useOrderContext();
  const {foodsInCart, checkedCart} = useCartContext();
  /* Custom dialog function  */
  const {showDialog} = useCustomDialog();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  /* Zod schema for debit card with minimum top up amount */
  const debitCardWithMinimumTopUpAmountSchema = debitCardSchemaWithTopUp.extend(
    {
      topUpAmount: z.string().refine(topUpAmount => {
        const topUpAmountNumber = parseFloat(topUpAmount);
        return topUpAmountNumber >= Math.abs(creditBalance - totalPrice);
      }, `You have to top up at least RM ${Math.abs(creditBalance - totalPrice).toFixed(2)}`),
    },
  );
  /* Type for debit card with minimum top up amount */
  type DebitCardWithMinimumTopUpAmountType = z.infer<
    typeof debitCardWithMinimumTopUpAmountSchema
  >;

  /* Form state for debit card with minimum top up amount */
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<DebitCardWithMinimumTopUpAmountType>({
    resolver: zodResolver(debitCardWithMinimumTopUpAmountSchema),
  });

  /* Handle top up and proceed payment for user that has insufficient fund */
  const handleTopUpAndProceedPayment = async (
    formData: DebitCardWithMinimumTopUpAmountType,
  ) => {
    /* Top up the account credit first */
    try {
      await topUpCredit.mutateAsync(Number(formData.topUpAmount));
      await saveTransactionHistory({
        amount: Number(formData.topUpAmount),
        createTime: Date.now().toString(),
        type: 'INCREASE',
        description: 'Topped up with bank card',
      });
    } catch (error) {
      console.log('Error top up to current balance ', error);
      showDialog(
        'Error',
        'Error proceeding with the top up. Please try again later',
        () =>
          navigation.navigate('DrawerLayout', {
            screen: 'BottomTabLayout',
            params: {
              screen: 'HomePage',
            },
          }),
      );
      return;
    }

    /* Proceed with the payment */
    try {
      const foodToCheckout = foodsInCart
        ?.filter(food => checkedCart.has(food.cartId))
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
      if (!foodToCheckout || foodToCheckout.length === 0) {
        showDialog('Error', 'Something went wrong');
        return;
      }

      await addOrderMutation.mutateAsync({
        ordersToAdd: foodToCheckout,
        totalPrice,
        paymentMethod: 'CREDIT',
      });
      showDialog('Success', 'Order placed successfully', () =>
        navigation.navigate('DrawerLayout', {
          screen: 'BottomTabLayout',
          params: {
            screen: 'OrderStack',
            params: {
              screen: 'AllOrderPage',
            },
          },
        }),
      );
    } catch (error) {
      showDialog('Error', 'Server error. Please try again later.', () =>
        navigation.navigate('DrawerLayout', {
          screen: 'BottomTabLayout',
          params: {
            screen: 'HomePage',
          },
        }),
      );
      console.log('Error proceeding with the payment ', error);
    }
  };

  const handleProceedPayment = async () => {
    /* Double check for foods that user wanted to checkout */
    const foodToCheckout = foodsInCart
      ?.filter(food => checkedCart.has(food.cartId))
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
    if (!foodToCheckout) {
      showDialog('Error', 'Something went wrong');
      return;
    }
    try {
      await addOrderMutation.mutateAsync({
        ordersToAdd: foodToCheckout,
        totalPrice,
        paymentMethod: 'CREDIT',
      });
      showDialog('Success', 'Order placed successfully', () =>
        navigation.navigate('DrawerLayout', {
          screen: 'BottomTabLayout',
          params: {
            screen: 'OrderStack',
            params: {
              screen: 'AllOrderPage',
            },
          },
        }),
      );
      await saveTransactionHistory({
        amount: totalPrice,
        type: 'DECREASE',
        createTime: Date.now().toString(),
        description: 'Placed foods order',
      });
    } catch (error) {
      showDialog('Error', 'Server error. Please try again later.', () =>
        navigation.navigate('DrawerLayout', {
          screen: 'BottomTabLayout',
          params: {
            screen: 'HomePage',
          },
        }),
      );
    }
  };

  return (
    <ScrollView
      className="p-4"
      contentContainerStyle={{paddingBottom: 35, flexGrow: 1}}>
      {/* Credit Card Display */}
      <CanteedCard />

      {/* Payment Details */}
      <View className="mt-8">
        {/* Container to display the discounted price */}
        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">Total amount to be paid</Text>
          <Text className="font-bold text-lg">RM {totalPrice.toFixed(2)}</Text>
        </View>
        {/* Container to display the point earned by this order */}
        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">
            Point earned by this order
          </Text>
          <Text className="font-bold text-lg text-green-600">
            {totalPrice > 10 ? (totalPrice / 10).toFixed(2) : 1} point
          </Text>
        </View>
        {/* Container to display the remaining balance after payment */}
        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">
            {creditBalance >= totalPrice
              ? 'Remaining Balance After Payment'
              : 'Additional required amount'}
          </Text>
          <Text
            className={`font-bold text-lg ${
              !sufficientCredit && !addOrderMutation.isSuccess
                ? 'text-red-500'
                : 'text-green-600'
            }`}>
            RM {Math.abs(creditBalance - totalPrice).toFixed(2)}
          </Text>
        </View>
      </View>

      <View>
        {/* Insufficient fund message */}
        {!sufficientCredit && !addOrderMutation.isSuccess && (
          <View>
            <View className="bg-red-100 p-3 rounded-lg">
              <Text className="text-red-600 text-center">
                Insufficient balance. Please enter your debit card details below
                to top up and proceed with the payment
              </Text>
            </View>
            {/* Debit card input page */}
            <DebitCartInputPage control={control} errors={errors} />
          </View>
        )}
        {/* Sufficient fund message */}
        {sufficientCredit && (
          <View style={[ShadowStyle.shadowBox, styles.successMessageContainer]}>
            <Text className="text-green-600 text-center">
              You have sufficient balance to proceed with the payment.
            </Text>
          </View>
        )}
      </View>

      {/* Button to top up and proceed with the payment */}
      {!sufficientCredit && (
        <View>
          <TouchableOpacity
            style={ButtonStyle.generalButton}
            onPress={handleSubmit(handleTopUpAndProceedPayment)}
            disabled={topUpCredit.isPending || addOrderMutation.isPending}>
            <Text style={ButtonStyle.generalButtonText}>
              Top up and pay now
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Button to proceed with the payment */}
      {sufficientCredit && (
        <View className="mt-auto">
          <TouchableOpacity
            disabled={addOrderMutation.isPending}
            style={[
              ButtonStyle.generalButton,
              addOrderMutation.isPending && {opacity: 0.7},
            ]}
            onPress={handleProceedPayment}>
            <Text style={ButtonStyle.generalButtonText}>
              {addOrderMutation.isPending
                ? 'Processing...'
                : 'Proceed with payment'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eachPaymentDetailContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  successMessageContainer: {
    backgroundColor: '#E6F9E6',
    shadowColor: '#A3D9A5',
    borderRadius: 10,
    padding: 16,
  },
});

export default PayWithAccountCreditPage;
