import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ShadowStyle} from '../../styles/ShadowStyle';
import {useState} from 'react';
import {RadioButton} from 'react-native-paper';
import {ButtonStyle} from '../../styles/ButtonStyles';
import {CheckoutStackParamList} from '../navigation/CheckoutStack';
import {PAYMENT_METHOD} from '../constant/constant';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function CheckoutPage({
  route,
  navigation,
}: NativeStackScreenProps<CheckoutStackParamList, 'CheckoutPage'>) {
  const totalPrice = route.params.totalPrice;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PAYMENT_METHOD | ''
  >('');

  const handlePayNow = () => {
    if (selectedPaymentMethod === 'COUNTER') {
      navigation.navigate('PayAtCounterPage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
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
              Use your existing account balance
            </Text>
            {selectedPaymentMethod === 'CREDIT' && (
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
      <View style={styles.totalPriceContainer}>
        <Text className="text-2xl font-bold mb-8 text-gray-800">
          Total Price:{' '}
          <Text className="text-3xl font-bold text-orange-500">
            RM {totalPrice.toFixed(2)}
          </Text>
        </Text>
        <TouchableOpacity
          style={[
            ButtonStyle.generalButton,
            selectedPaymentMethod === '' && styles.payButtonWhenNoneSelected,
          ]}
          disabled={selectedPaymentMethod === ''}
          onPress={handlePayNow}>
          <Text style={ButtonStyle.generalButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop: 'auto',
    marginBottom: 24,
  },
  payButtonWhenNoneSelected: {
    backgroundColor: 'rgba(238,167,52,0.3)',
  },
});
