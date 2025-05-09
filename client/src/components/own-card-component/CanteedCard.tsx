import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {useAuthContext} from '../../context/AuthProvider';
import {usePointAndCredit} from '../../context/PointAndCreditProvider';

const CanteedCard = () => {
  const {user} = useAuthContext();
  const {creditBalance, pointBalance} = usePointAndCredit();
  return (
    <View style={[ShadowStyle.shadowBox, styles.creditCardContainer]}>
      <View>
        <Text className="text-white text-lg">
          {user?.displayName}'s credit balance
        </Text>
        <Text className="text-white text-2xl font-bold mt-2">
          RM {creditBalance.toFixed(2)}
        </Text>
        <Text className="text-white text-xl font-semibold mt-2">
          Points: {pointBalance}
        </Text>
      </View>
      <View>
        <Text className="text-white opacity-70">Canteen card</Text>
      </View>
    </View>
  );
};

export default CanteedCard;

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
    elevation: 15,
  },
});
