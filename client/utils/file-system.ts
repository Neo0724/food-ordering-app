import RNFS from 'react-native-fs';

const searchHistoryFilePath = `${RNFS.DocumentDirectoryPath}/search-history.txt`;
const transactionHistoryFilePath = `${RNFS.DocumentDirectoryPath}/transaction-history.json`;

export async function getSearchHistory() {
  try {
    await RNFS.readFile(searchHistoryFilePath);
    const allHistory = await RNFS.readFile(searchHistoryFilePath);
    const splitedHistory = allHistory
      .split('\n')
      .filter(line => line.trim().length > 0);
    return splitedHistory;
  } catch (error) {
    console.log('Error writing file:', error);
  }
}

export async function saveSearchHistory(newHistory: string[]) {
  try {
    let stringHistory = '';
    newHistory.forEach(foodName => {
      stringHistory += foodName + '\n';
    });
    await RNFS.writeFile(searchHistoryFilePath, stringHistory, 'utf8');
  } catch (error) {
    console.log('Error saving search history:', error);
  }
}

export async function createSearchHistoryFile() {
  try {
    const fileExists = await RNFS.exists(searchHistoryFilePath);

    if (!fileExists) {
      await RNFS.writeFile(searchHistoryFilePath, '');
      console.log('Search history file is created');
    }
  } catch (error) {
    console.log('Error creating search history file: ' + error);
  }
}

export async function createTransactionHistoryFile() {
  try {
    const fileExists = await RNFS.exists(transactionHistoryFilePath);

    if (!fileExists) {
      const emptyTransactionHistory = {
        transactionHistory: [],
      };

      await RNFS.writeFile(
        transactionHistoryFilePath,
        JSON.stringify(emptyTransactionHistory),
      );
      console.log('Transaction history file is created');
    }
  } catch (error) {
    console.log('Error creating search history file: ' + error);
  }
}

export type TransactionHistory = {
  createTime: string;
  type: 'INCREASE' | 'DECREASE';
  amount: number;
  description: string;
};

type TransactionHistoryJsonType = {
  transactionHistory: TransactionHistory[];
};

export async function getTransactionHistory() {
  try {
    let transactionHistory = await RNFS.readFile(transactionHistoryFilePath);
    const parsedTransactionHistory = await JSON.parse(transactionHistory);
    console.log(parsedTransactionHistory);
    return (parsedTransactionHistory as TransactionHistoryJsonType)
      .transactionHistory;
  } catch (error) {
    console.log('Error retrieving transaction history');
  }
}

export async function saveTransactionHistory(
  transactionHistory: TransactionHistory,
) {
  try {
    const prevTransactionHistory = await getTransactionHistory();
    if (prevTransactionHistory) {
      prevTransactionHistory.unshift(transactionHistory);
      await RNFS.writeFile(
        transactionHistoryFilePath,
        JSON.stringify({transactionHistory: prevTransactionHistory}),
      );
    }
  } catch (error) {
    console.log('Error saving transaction:', error);
  }
}
