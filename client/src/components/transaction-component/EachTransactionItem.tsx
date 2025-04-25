import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {TransactionHistory} from '../../../utils/file-system';
import {ShadowStyle} from '../../../styles/ShadowStyle';

type EachTransactionItemProps = {
  transactionHistory: TransactionHistory;
};

const EachTransactionItem = ({
  transactionHistory,
}: EachTransactionItemProps) => {
  const {type, description, amount, createTime} = transactionHistory;

  return (
    <View
      style={[
        ShadowStyle.shadowBox,
        styles.transactionContainer,
        type === 'INCREASE'
          ? styles.increaseContainer
          : styles.decreaseContainer,
      ]}>
      <View className="mb-3">
        <Text className="text-md text-gray-600">
          {new Date(parseInt(createTime, 10)).toLocaleDateString()}
        </Text>
      </View>
      <Text className="text-md text-gray-600 mb-5">{description}</Text>
      <View>
        <Text
          style={[
            styles.amountText,
            type === 'INCREASE' ? styles.increase : styles.decrease,
          ]}>{`${type === 'INCREASE' ? '+' : '-'} RM ${amount.toFixed(
          2,
        )}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 12,
    marginVertical: 10,
  },

  increaseContainer: {
    borderWidth: 2,
    borderColor: 'rgb(144, 238, 144)',
    shadowColor: 'green',
  },
  decreaseContainer: {
    borderWidth: 2,
    borderColor: 'rgb(255, 182, 200)',
    shadowColor: 'red',
  },

  increase: {
    color: '#4CAF50',
  },
  decrease: {
    color: '#F44336',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EachTransactionItem;
