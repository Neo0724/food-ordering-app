/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
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
import CustomDialog from '../CustomDialog';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootLayout';
import DebitCartInputPage from './DebitCartInputPage';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {debitCardSchemaWithTopUp} from './schemas/debit-cart-schema';

const PayWithAccountCreditPage = ({
  route,
}: NativeStackScreenProps<
  CheckoutStackParamList,
  'PayWithAccountCreditPage'
>) => {
  const totalPrice = route.params.totalPrice;
  const {creditBalance, topUpCredit} = usePointAndCredit();
  const sufficientCredit = creditBalance >= totalPrice;
  const accountHolderName = auth().currentUser?.displayName;
  const {addOrderMutation} = useOrderContext();
  const {foodsInCart} = useCartContext();
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [visible, setVisible] = useState(false);
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
    } catch (error) {
      console.log('Error top up to current balance ', error);
      setDialogTitle('Error');
      setDialogMessage(
        'Error proceeding with the top up. Please try again later',
      );
      setVisible(true);
      return;
    }

    /* Proceed with the payment */
    try {
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
      if (!filteredFood) {
        setDialogTitle('Error');
        setDialogMessage('Something went wrong');
        setVisible(true);
        return;
      }

      await addOrderMutation.mutateAsync({
        ordersToAdd: filteredFood,
        totalPrice,
        paymentMethod: 'CREDIT',
      });
      setDialogTitle('Success');
      setDialogMessage('Order placed successfully');
      setVisible(true);
    } catch (error) {
      setDialogTitle('Error');
      setDialogMessage('Server error. Please try again later.');
      setVisible(true);
      console.log('Error proceeding with the payment ', error);
    }
  };

  const handleProceedPayment = async () => {
    /* Double check for foods that user wanted to checkout */
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
    if (!filteredFood) {
      setDialogTitle('Error');
      setDialogMessage('Something went wrong');
      setVisible(true);
      return;
    }
    try {
      await addOrderMutation.mutateAsync({
        ordersToAdd: filteredFood,
        totalPrice,
        paymentMethod: 'CREDIT',
      });
      setDialogTitle('Success');
      setDialogMessage('Order placed successfully');
      setVisible(true);
    } catch (error) {
      setDialogTitle('Error');
      setDialogMessage('Server error. Please try again later.');
      setVisible(true);
    }
  };

  return (
    <ScrollView
      className="p-4 flex-1"
      contentContainerStyle={{paddingBottom: 35}}>
      <CustomDialog
        title={dialogTitle}
        message={dialogMessage}
        visible={visible}
        setVisible={setVisible}
        onCloseFunction={() => {
          if (addOrderMutation.isError || topUpCredit.isError) {
            navigation.navigate('BottomTabLayout', {
              screen: 'HomePage',
            });
          } else {
            navigation.navigate('BottomTabLayout', {
              screen: 'OrderPage',
            });
          }
        }}
      />
      {/* Credit Card Display */}
      <View style={[ShadowStyle.shadowBox, styles.creditCardContainer]}>
        <View>
          <Text className="text-white text-lg">
            {accountHolderName}'s credit balance
          </Text>
          <Text className="text-white text-2xl font-bold mt-2">
            RM {creditBalance.toFixed(2)}
          </Text>
        </View>
        <View>
          <Text className="text-white opacity-70">Canteen card</Text>
        </View>
      </View>

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
              !sufficientCredit ? 'text-red-500' : 'text-green-600'
            }`}>
            RM {Math.abs(creditBalance - totalPrice).toFixed(2)}
          </Text>
        </View>
      </View>

      <View className="mt-2">
        {/* Insufficient fund message */}
        {!sufficientCredit && (
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
        <View className="mt-8">
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
        <View className="mt-[3rem]">
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
  creditCardContainer: {
    backgroundColor: '#007bff',
    shadowColor: '#0056b3',
    padding: 16,
    borderRadius: 10,
    height: 200,
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#004a99',
  },
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
