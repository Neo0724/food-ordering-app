/* eslint-disable @typescript-eslint/no-unused-vars */
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
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

const PayWithAccountCreditPage = ({
  route,
}: NativeStackScreenProps<
  CheckoutStackParamList,
  'PayWithAccountCreditPage'
>) => {
  const totalPrice = route.params.totalPrice;
  const {creditBalance} = usePointAndCredit();
  const canProceed = creditBalance >= totalPrice;
  const accountHolderName = auth().currentUser?.displayName;
  const {addOrderMutation} = useOrderContext();
  const {foodsInCart} = useCartContext();
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleProceedPayment = async () => {
    setIsLoading(true);
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
      Alert.alert('Something went wrong');
      setIsLoading(false);
      return;
    }
    try {
      addOrderMutation.mutateAsync({
        ordersToAdd: filteredFood,
        totalPrice,
        setDialogTitle,
        setDialogMessage,
        setVisible,
        paymentMethod: 'CREDIT',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4">
      <CustomDialog
        title={dialogTitle}
        message={dialogMessage}
        visible={visible}
        setVisible={setVisible}
        onCloseFunction={() => {
          navigation.navigate('BottomTabLayout', {
            screen: 'OrderPage',
          });
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
        {/* Container to display the point earned by this transaction */}
        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">
            Point earned by this transaction
          </Text>
          <Text className="font-bold text-lg text-green-600">
            {(totalPrice / 10).toFixed(2)} point
          </Text>
        </View>
        {/* Container to display the remaining balance after payment */}
        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">
            Remaining Balance After Payment:
          </Text>
          <Text
            className={`font-bold text-lg ${
              !canProceed ? 'text-red-500' : 'text-green-600'
            }`}>
            RM {(creditBalance - totalPrice).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Warning or Success Message */}
      <View className="mt-8">
        {!canProceed ? (
          <View className="bg-red-100 p-4 rounded-lg">
            <Text className="text-red-600 text-center">
              Insufficient balance. Please top up your account to proceed with
              payment.
            </Text>
          </View>
        ) : (
          <View style={[ShadowStyle.shadowBox, styles.successMessageContainer]}>
            <Text className="text-green-600 text-center">
              You have sufficient balance to proceed with the payment.
            </Text>
          </View>
        )}
      </View>

      {/* Button to top up */}
      {!canProceed && (
        <View className="mt-8">
          <TouchableOpacity className="bg-blue-600 p-4 rounded-lg">
            <Text>Top up balance</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Button to proceed with the payment */}
      {canProceed && (
        <View className="mt-[3rem]">
          <TouchableOpacity
            disabled={isLoading || addOrderMutation.isPending}
            style={[
              ButtonStyle.generalButton,
              (isLoading || addOrderMutation.isPending) && {opacity: 0.7},
            ]}
            onPress={handleProceedPayment}>
            <Text style={ButtonStyle.generalButtonText}>
              {isLoading || addOrderMutation.isPending
                ? 'Processing...'
                : 'Proceed with payment'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
