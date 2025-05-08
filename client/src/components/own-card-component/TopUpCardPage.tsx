import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useForm} from 'react-hook-form';
import {
  debitCardSchemaWithTopUp,
  DebitCardWithTopUpType,
} from '../checkout-components/schemas/debit-cart-schema';
import {zodResolver} from '@hookform/resolvers/zod';
import DebitCartInputPage from '../checkout-components/DebitCartInputPage';
import {ButtonStyle} from '../../../styles/ButtonStyles';
import {OwnCardStackParamList} from '../../navigation/OwnCardStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCustomDialog} from '../../context/CustomDialogContext';
import {saveTransactionHistory} from '../../../utils/file-system';

type TopUpCardPageProp = NativeStackScreenProps<
  OwnCardStackParamList,
  'TopUpCardPage'
>;

const TopUpCardPage = ({route, navigation}: TopUpCardPageProp) => {
  const topUpCredit = route.params.topUpCredit;
  const {showDialog} = useCustomDialog();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<DebitCardWithTopUpType>({
    resolver: zodResolver(debitCardSchemaWithTopUp),
  });

  const handleTopUp = async (formData: DebitCardWithTopUpType) => {
    try {
      await topUpCredit.mutateAsync(Number(formData.topUpAmount));
      await saveTransactionHistory({
        amount: Number(formData.topUpAmount),
        createTime: Date.now().toString(),
        type: 'INCREASE',
        description: 'Topped up with bank card',
      });
      showDialog('Success!', 'Top up successful!', () =>
        navigation.navigate('OwnCardPage'),
      );
    } catch (error) {
      showDialog(
        'Error',
        'Error proceeding with the top up. Please try again later',
        () => navigation.navigate('OwnCardPage'),
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.parentContainer}>
      <DebitCartInputPage control={control} errors={errors} />
      <View className="mt-10">
        <TouchableOpacity
          // disabled={addOrderMutation.isPending}
          style={[
            ButtonStyle.generalButton,
            // addOrderMutation.isPending && {opacity: 0.7},
          ]}
          onPress={handleSubmit(handleTopUp)}>
          <Text style={ButtonStyle.generalButtonText}>Proceed with top up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    padding: 16,
    overflow: 'visible',
  },
});

export default TopUpCardPage;
