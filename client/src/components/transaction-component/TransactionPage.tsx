import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  getTransactionHistory,
  TransactionHistory,
} from '../../../utils/file-system';
import EachTransactionItem from './EachTransactionItem';

const TransactionPage = () => {
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionHistory[]
  >([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const fetchedHistory = await getTransactionHistory();
        fetchedHistory && setTransactionHistory(fetchedHistory);
      } catch (error) {
        console.log('Error fetching transaction history');
      }
    };

    fetchTransactionHistory();
  }, []);

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.title}>Transaction History</Text>
      {transactionHistory.map((transaction, index) => (
        <EachTransactionItem key={index} transactionHistory={transaction} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
});

export default TransactionPage;
