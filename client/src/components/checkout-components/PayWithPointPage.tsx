/* eslint-disable @typescript-eslint/no-unused-vars */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {usePointAndCredit} from '../../context/PointAndCreditProvider';
import {CheckoutStackParamList} from '../../navigation/CheckoutStack';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import CustomDialog from '../CustomDialog';
import {RootStackParamList} from '../../navigation/RootLayout';
import {useCartContext} from '../../context/CartProvider';
import {useOrderContext} from '../../context/OrderProvider';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {ButtonStyle} from '../../../styles/ButtonStyles';

const PayWithPointPage = ({
  route,
}: NativeStackScreenProps<CheckoutStackParamList, 'PayWithPointPage'>) => {
  const totalPrice = route.params.totalPrice;
  const {pointBalance} = usePointAndCredit();
  const {addOrderMutation} = useOrderContext();
  const {foodsInCart} = useCartContext();
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const pointRequired = totalPrice * 10;
  const sufficientPoint = pointBalance >= pointRequired;
  const username = auth().currentUser?.displayName;

  const handleProceedPayment = async () => {
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
        paymentMethod: 'POINT',
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
    <View style={styles.parentContainer}>
      <CustomDialog
        title={dialogTitle}
        message={dialogMessage}
        visible={visible}
        setVisible={setVisible}
        onCloseFunction={() => {
          if (addOrderMutation.isError) {
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

      {/* Point Balance Display */}
      <View style={[ShadowStyle.shadowBox, styles.pointCardContainer]}>
        <View>
          <Text className="text-white text-lg">{username}'s point balance</Text>
          <Text className="text-white text-2xl font-bold mt-2">
            {pointBalance.toFixed(2)} points
          </Text>
        </View>
        <View>
          <Text className="text-white opacity-70">Canteen points</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View className="mt-8 flex-grow">
        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">Total amount to be paid</Text>
          <Text className="font-bold text-lg">RM {totalPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">Points required</Text>
          <Text className="font-bold text-lg">
            {pointRequired.toFixed(2)} points
          </Text>
        </View>

        <View style={styles.eachPaymentDetailContainer}>
          <Text className="text-gray-600 text-lg">
            Remaining Points After Payment:
          </Text>
          <Text
            className={`font-bold text-lg ${
              !sufficientPoint ? 'text-red-500' : 'text-green-600'
            }`}>
            {(pointBalance - pointRequired).toFixed(2)} points
          </Text>
        </View>
      </View>

      {/* Insufficient point balance */}
      {!sufficientPoint && (
        <View className="bg-red-100 p-4 rounded-lg">
          <Text className="text-red-600 text-center">
            Insufficient points. Please earn more points or use another payment
            method.
          </Text>
        </View>
      )}

      {/* Sufficient point balance */}
      {sufficientPoint && (
        <TouchableOpacity
          style={[
            ButtonStyle.generalButton,
            addOrderMutation.isPending && {opacity: 0.7},
          ]}
          disabled={addOrderMutation.isPending}
          onPress={handleProceedPayment}>
          <Text style={ButtonStyle.generalButtonText}>Pay with Points</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    margin: 20,
  },
  pointCardContainer: {
    backgroundColor: '#8A2BE2',
    shadowColor: '#4B0082',
    elevation: 8,
    borderRadius: 20,
    padding: 25,
    height: 200,
    borderWidth: 3,
    justifyContent: 'space-between',
    borderColor: '#6A0DAD',
  },
  eachPaymentDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default PayWithPointPage;
