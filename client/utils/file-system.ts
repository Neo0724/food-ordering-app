import {SetStateAction} from 'react';
import RNFS from 'react-native-fs';

export async function getSearchHistory(
) {
  const filePath = `${RNFS.DocumentDirectoryPath}/search-history.txt`;
  try {
    // await RNFS.writeFile(filePath, '');
    await RNFS.readFile(filePath);
    const allHistory = await RNFS.readFile(filePath);
    const splitedHistory = allHistory
      .split('\n')
      .filter(line => line.trim().length > 0);
    return splitedHistory;
  } catch (error) {
    console.log('Error writing file:', error);
  }
}

export async function saveSearchHistory(newHistory: string[]) {
  const filePath = `${RNFS.DocumentDirectoryPath}/search-history.txt`;
  try {
    let stringHistory = '';
    newHistory.forEach(foodName => {
      stringHistory += foodName + '\n';
    });
    await RNFS.writeFile(filePath, stringHistory, 'utf8');
  } catch (error) {
    console.log('Error writing file:', error);
  }
}
