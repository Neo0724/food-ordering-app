import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  getTransactionHistory,
  TransactionHistory,
} from '../../../utils/file-system';
import EachTransactionItem from './EachTransactionItem';
import {useAuthContext} from '../../context/AuthProvider';

const TransactionPage = () => {
  const {userId} = useAuthContext();
  const [transactionHistory, setTransactionHistory] = useState<
    TransactionHistory[]
  >([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const fetchedHistory = await getTransactionHistory(userId as string);
        fetchedHistory && setTransactionHistory(fetchedHistory);
      } catch (error) {
        console.log('Error fetching transaction history');
      }
    };

    fetchTransactionHistory();
  }, [userId]);

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.title}>Transaction History</Text>
      <ScrollView>
        {transactionHistory.map((transaction, index) => (
          <EachTransactionItem key={index} transactionHistory={transaction} />
        ))}
      </ScrollView>
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
