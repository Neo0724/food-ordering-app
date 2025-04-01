/* eslint-disable react-native/no-inline-styles */
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {useState} from 'react';
import {RadioButton} from 'react-native-paper';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {CheckoutStackParamList} from '../../navigation/CheckoutStack';
import {PAYMENT_METHOD} from '../../constant/constant';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {usePointAndCredit} from '../../context/PointAndCreditProvider';
export default function CheckoutPage({
  route,
  navigation,
}: NativeStackScreenProps<CheckoutStackParamList, 'CheckoutPage'>) {
  const totalPrice = route.params.totalPrice;
  const {creditBalance, pointBalance} = usePointAndCredit();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PAYMENT_METHOD | ''
  >('');

  const handlePayNow = () => {
    if (selectedPaymentMethod === 'COUNTER') {
      navigation.navigate('PayAtCounterPage', {totalPrice});
    } else if (selectedPaymentMethod === 'EWALLET') {
      navigation.navigate('PayWithEWalletPage', {totalPrice});
    } else if (selectedPaymentMethod === 'CREDIT') {
      navigation.navigate('PayWithAccountCreditPage', {totalPrice});
    } else if (selectedPaymentMethod === 'POINT') {
      navigation.navigate('PayWithPointPage', {totalPrice});
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      <View className="flex-grow">
        {/* Credit payment method */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            ShadowStyle.shadowBox,
            selectedPaymentMethod === 'CREDIT' && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPaymentMethod('CREDIT')}>
          <View style={styles.paymentOptionContent}>
            <RadioButton
              value="credit"
              status={
                selectedPaymentMethod === 'CREDIT' ? 'checked' : 'unchecked'
              }
              onPress={() => setSelectedPaymentMethod('CREDIT')}
            />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentTitle}>Pay with Account Credit</Text>
              <Text style={styles.paymentDescription}>
                Use your existing credit balance
              </Text>
              <Text
                style={[
                  styles.paymentDescription,
                  {
                    color: creditBalance > totalPrice ? 'green' : 'red',
                  },
                ]}>
                Available credit: RM {creditBalance.toFixed(2)}
                {creditBalance < totalPrice && ' (Insufficient)'}
              </Text>
              {selectedPaymentMethod === 'CREDIT' && (
                <Text style={styles.selectedText}>Selected</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Point payment method */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            ShadowStyle.shadowBox,
            selectedPaymentMethod === 'POINT' && styles.selectedPayment,
            pointBalance < totalPrice * 10 && {opacity: 0.5},
          ]}
          disabled={pointBalance < totalPrice * 10}
          onPress={() => setSelectedPaymentMethod('POINT')}>
          <View style={styles.paymentOptionContent}>
            <RadioButton
              disabled={pointBalance < totalPrice * 10}
              value="point"
              status={
                selectedPaymentMethod === 'POINT' ? 'checked' : 'unchecked'
              }
              onPress={() => setSelectedPaymentMethod('POINT')}
            />
            <View style={styles.paymentDetails}>
              <Text
                style={[
                  styles.paymentTitle,
                  pointBalance < totalPrice * 10 && {color: '#999'},
                ]}>
                Pay with Points
              </Text>
              <Text
                style={[
                  styles.paymentDescription,
                  pointBalance < totalPrice * 10 && {color: '#999'},
                ]}>
                Use your existing point balance
              </Text>
              <Text
                style={[
                  styles.paymentDescription,
                  pointBalance < totalPrice * 10
                    ? {color: 'red'}
                    : {color: 'green'},
                ]}>
                Available points: {pointBalance}
              </Text>
              {pointBalance < totalPrice * 10 && (
                <Text className="text-red-600">
                  Insufficient points (Required: {(totalPrice * 10).toFixed(2)})
                </Text>
              )}
              {selectedPaymentMethod === 'POINT' && (
                <Text style={styles.selectedText}>Selected</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* E-Wallet payment method */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            ShadowStyle.shadowBox,
            selectedPaymentMethod === 'EWALLET' && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPaymentMethod('EWALLET')}>
          <View style={styles.paymentOptionContent}>
            <RadioButton
              value="ewallet"
              status={
                selectedPaymentMethod === 'EWALLET' ? 'checked' : 'unchecked'
              }
              onPress={() => setSelectedPaymentMethod('EWALLET')}
            />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentTitle}>Pay with E-Wallet</Text>
              <Text style={styles.paymentDescription}>
                GrabPay, Touch n Go, etc
              </Text>
              {selectedPaymentMethod === 'EWALLET' && (
                <Text style={styles.selectedText}>Selected</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Counter payment method */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            ShadowStyle.shadowBox,
            selectedPaymentMethod === 'COUNTER' && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPaymentMethod('COUNTER')}>
          <View style={styles.paymentOptionContent}>
            <RadioButton
              value="counter"
              status={
                selectedPaymentMethod === 'COUNTER' ? 'checked' : 'unchecked'
              }
              onPress={() => setSelectedPaymentMethod('COUNTER')}
            />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentTitle}>Pay at Counter</Text>
              <Text style={styles.paymentDescription}>
                Pay when collecting your order
              </Text>
              {selectedPaymentMethod === 'COUNTER' && (
                <Text style={styles.selectedText}>Selected</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Total price and pay now container */}
      <View style={styles.totalPriceContainer}>
        <View className="flex-col mt-3">
          {/* Discounted price container */}
          <View
            style={[ShadowStyle.shadowBox, styles.totalAndFinalPriceContainer]}>
            <View className="flex-col">
              {/* Container for total price */}
              <View className="flex-row items-center gap-1">
                <Text className="text-2xl font-bold">Total Price:</Text>
                <Text className="text-3xl font-bold text-orange-500 ml-2">
                  RM {totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[
            ButtonStyle.generalButton,
            selectedPaymentMethod === '' && {opacity: 0.5},
          ]}
          disabled={selectedPaymentMethod === ''}
          onPress={handlePayNow}>
          <Text style={ButtonStyle.generalButtonText}>
            {selectedPaymentMethod === 'CREDIT' && totalPrice > creditBalance
              ? 'Top up and pay now'
              : 'Pay now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  paymentOption: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.8)',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  selectedPayment: {
    borderWidth: 2,
    borderColor: 'rgb(238,167,52)',
  },
  selectedText: {
    color: 'rgb(238,167,52)',
    marginTop: 8,
    fontWeight: '500',
  },
  totalPriceContainer: {
    // marginTop: 16,
    // marginBottom: 50,
  },
  usePointsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  totalAndFinalPriceContainer: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },

  pointsTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.8)',
  },
  pointsBalance: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
});
