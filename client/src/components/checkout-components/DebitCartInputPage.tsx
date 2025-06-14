/* eslint-disable react-native/no-inline-styles */
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Control, FieldErrors} from 'react-hook-form';
import {Controller} from 'react-hook-form';
import {DebitCardWithTopUpType} from './schemas/debit-cart-schema';
import {ShadowStyle} from '../../../styles/ShadowStyle';
type DebitCardInputPageProps = {
  control: Control<DebitCardWithTopUpType>;
  errors: FieldErrors<DebitCardWithTopUpType>;
};

const DebitCartInputPage = ({control, errors}: DebitCardInputPageProps) => {
  const formatCardNumber = (enteredCardNumber: string) => {
    const retainedOnlyNumbers = enteredCardNumber.replace(/\D/g, '');
    return retainedOnlyNumbers.match(/\d{1,4}/g)?.join(' ') || '';
  };

  return (
    <View>
      <View style={[ShadowStyle.shadowBox, styles.debitCardInputContainer]}>
        <Text className="text-lg font-semibold mb-4">
          Enter Your Card Details
        </Text>

        {/* Card number input */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Card Number</Text>
          <Controller
            control={control}
            name="cardNumber"
            render={({field: {onChange, value}}) => (
              <TextInput
                className="border border-gray-300 rounded-lg p-2"
                placeholder="1234 1234 1234 1234"
                value={value}
                onChangeText={text => onChange(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
              />
            )}
          />
          {errors.cardNumber && (
            <Text style={styles.errorText}>{errors.cardNumber.message}</Text>
          )}
        </View>

        {/* Card holder name input */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Card Holder Name</Text>
          <Controller
            control={control}
            name="cardHolder"
            render={({field: {onChange, value}}) => (
              <TextInput
                className="border border-gray-300 rounded-lg p-2"
                placeholder="HELLO WORLD"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.cardHolder && (
            <Text style={styles.errorText}>{errors.cardHolder.message}</Text>
          )}
        </View>

        {/* Month and year input */}
        <View className="justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-gray-600 mb-2">Expiry Date</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Controller
                control={control}
                name="expiredMonth"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                    placeholder="MM"
                    value={value}
                    onChangeText={text => {
                      const month = text.replace(/\D/g, '');
                      if (month.length === 1) {
                        onChange('0' + month === '0' ? '1' : '0');
                      } else {
                        onChange(month);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                )}
              />
              <Controller
                control={control}
                name="expiredYear"
                render={({field: {onChange, value}}) => (
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                    placeholder="YY"
                    value={value}
                    onChangeText={text => onChange(text.replace(/\D/g, ''))}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                )}
              />
            </View>
            <View className="flex-row gap-2">
              {errors.expiredMonth && (
                <Text style={styles.errorText}>
                  {errors.expiredMonth.message}
                </Text>
              )}
              {errors.expiredYear && (
                <Text style={styles.errorText}>
                  {errors.expiredYear.message}
                </Text>
              )}
            </View>
          </View>

          {/* CVV input */}
          <View className="flex-1 mt-4">
            <Text className="text-gray-600 mb-2">CVV</Text>
            <Controller
              control={control}
              name="cvv"
              render={({field: {onChange, value}}) => (
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  placeholder="123"
                  value={value}
                  onChangeText={text => onChange(text.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              )}
            />
            {errors.cvv && (
              <Text style={styles.errorText}>{errors.cvv.message}</Text>
            )}
          </View>
        </View>
      </View>
      {/* Container for top up amount */}
      <View style={[ShadowStyle.shadowBox, styles.topUpAmountContainer]}>
        <Text className="text-lg font-semibold mb-4">Top up amount</Text>
        <Controller
          control={control}
          name="topUpAmount"
          render={({field: {onChange, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-2"
              placeholder="0.00"
              value={value}
              onChangeText={text => onChange(text.replace(/\D+/g, ''))}
              keyboardType="numeric"
              maxLength={10}
            />
          )}
        />
        {errors.topUpAmount && (
          <Text style={styles.errorText}>{errors.topUpAmount.message}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    flex: 1,
  },
  debitCardInputContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  topUpAmountContainer: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default DebitCartInputPage;
