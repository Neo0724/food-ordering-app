import RNFS from 'react-native-fs';

export type TransactionHistory = {
  createTime: string;
  type: 'INCREASE' | 'DECREASE';
  amount: number;
  description: string;
};

const searchHistoryFilePath = `${RNFS.DocumentDirectoryPath}/search-history.txt`;
const transactionHistoryFilePath = `${RNFS.DocumentDirectoryPath}/transaction-history.json`;

export async function getSearchHistory(userId: string) {
  try {
    await RNFS.readFile(searchHistoryFilePath);
    const allHistory = await RNFS.readFile(searchHistoryFilePath);
    const parsedAllHistory = await JSON.parse(allHistory);
    return parsedAllHistory[userId];
  } catch (error) {
    console.log('Error writing file:', error);
  }
}

async function getAllSearchHistory() {
  try {
    await RNFS.readFile(searchHistoryFilePath);
    const allHistory = await RNFS.readFile(searchHistoryFilePath);
    const parsedAllHistory = await JSON.parse(allHistory);
    return parsedAllHistory;
  } catch (error) {
    console.log('Error getting file:', error);
  }
}

export async function saveSearchHistory(newHistory: string[], userId: string) {
  try {
    const allHistory = await getAllSearchHistory();
    if (allHistory && allHistory[userId]) {
      allHistory[userId] = newHistory;
      await RNFS.writeFile(searchHistoryFilePath, JSON.stringify(allHistory));
    } else {
    }
  } catch (error) {
    console.log('Error saving search history:', error);
  }
}

export async function createSearchHistoryFile(userId: string) {
  try {
    const fileExists = await RNFS.exists(searchHistoryFilePath);
    const emptyHistory = {
      [userId]: [],
    };

    if (!fileExists) {
      await RNFS.writeFile(searchHistoryFilePath, JSON.stringify(emptyHistory));
      console.log('Search history file is created');
    } else {
      const allHistory = await getAllSearchHistory();
      if (!allHistory[userId]) {
        allHistory[userId] = [];
        await RNFS.writeFile(searchHistoryFilePath, JSON.stringify(allHistory));
      }
    }
  } catch (error) {
    console.log('Error creating search history file: ' + error);
  }
}

export async function createTransactionHistoryFile(userId: string) {
  try {
    const fileExists = await RNFS.exists(transactionHistoryFilePath);

    if (!fileExists) {
      const emptyTransactionHistory = {
        [userId]: [],
      };

      await RNFS.writeFile(
        transactionHistoryFilePath,
        JSON.stringify(emptyTransactionHistory),
      );
      console.log('Transaction history file is created');
    } else {
      const transactionHistory = await RNFS.readFile(
        transactionHistoryFilePath,
      );
      const parsedTransactionHistory = await JSON.parse(transactionHistory);
      if (Object.keys(parsedTransactionHistory).indexOf(userId) < 0) {
        parsedTransactionHistory[userId] = [];
        await RNFS.writeFile(
          transactionHistoryFilePath,
          JSON.stringify(parsedTransactionHistory),
        );
      }
    }
  } catch (error) {
    console.log('Error creating search history file: ' + error);
  }
}

type TransactionHistoryJsonType = Record<string, TransactionHistory[]>;
export async function getTransactionHistory(userId: string) {
  try {
    let transactionHistory = await RNFS.readFile(transactionHistoryFilePath);
    const parsedTransactionHistory = await JSON.parse(transactionHistory);
    console.log(parsedTransactionHistory);
    return (parsedTransactionHistory as TransactionHistoryJsonType)[userId];
  } catch (error) {
    console.log('Error retrieving transaction history');
  }
}

async function getAllTransactionHistory() {
  try {
    let transactionHistory = await RNFS.readFile(transactionHistoryFilePath);
    const parsedTransactionHistory = await JSON.parse(transactionHistory);
    console.log(parsedTransactionHistory);
    return parsedTransactionHistory as TransactionHistoryJsonType;
  } catch (error) {
    console.log('Error retrieving transaction history');
  }
}

export async function saveTransactionHistory(
  transactionHistory: TransactionHistory,
  userId: string,
) {
  try {
    let prevTransactionHistory = await getAllTransactionHistory();
    if (prevTransactionHistory && prevTransactionHistory[userId]) {
      /* Add the new transaction at the first position */
      let userTransactionHistory = prevTransactionHistory[userId];
      userTransactionHistory.unshift(transactionHistory);
      await RNFS.writeFile(
        transactionHistoryFilePath,
        JSON.stringify(prevTransactionHistory),
      );
    } else {
      createTransactionHistoryFile(userId);
    }
  } catch (error) {
    console.log('Error saving transaction:', error);
  }
}
