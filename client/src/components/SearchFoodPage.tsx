import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FoodStackParamList} from '../navigation/FoodStack';
import {Searchbar} from 'react-native-paper';
import {ShadowStyle} from '../../styles/ShadowStyle';
import {SearchBarStyles} from '../../styles/SearchBarStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSearchFoodContext} from '../context/SearchFoodProvider';
import {ScrollView} from 'react-native';
import useFood from '../custom-hook/useFood';
import {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';

const SearchFoodPage = ({
  route,
  navigation,
}: NativeStackScreenProps<FoodStackParamList, 'SearchFoodScreen'>) => {
  const [history, setHistory] = useState<string[]>([]);
  useEffect(() => {
    (async function () {
      const filePath = `${RNFS.DocumentDirectoryPath}/search-history.txt`;
      try {
        await RNFS.writeFile(filePath, 'fried chicken\ncheese pizza\n', 'utf8');
        console.log('Search history written to file!');
        const allHistory = await RNFS.readFile(filePath);
        const splitedHistory = allHistory
          .split('\n')
          .filter(line => line.trim().length > 0);
        setHistory(splitedHistory);
      } catch (error) {
        console.log('Error writing file:', error);
      }
    })();
  }, []);
  const {searchFoodName, setSearchFoodName} = useSearchFoodContext();
  const {handleSearchFood} = useFood();
  const handlePressSearchFood = () => {
    handleSearchFood(searchFoodName);
    navigation.goBack();
  };
  return (
    <View style={styles.parentContainer}>
      <View style={styles.searchBarContainer}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={32}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        {/* Search bar for user to search food */}
        <Searchbar
          style={[ShadowStyle.shadowBox, styles.searchBar]}
          placeholder="Search for your favorite food..."
          iconColor="white"
          cursorColor="white"
          placeholderTextColor="rgba(255,255,255,0.8)"
          inputStyle={{color: 'white', fontSize: 16}}
          value={searchFoodName}
          onChangeText={text => {
            setSearchFoodName(text);
          }}
          autoFocus={true}
          onSubmitEditing={handlePressSearchFood}
          onClearIconPress={() => setSearchFoodName('')}
        />
      </View>
      <ScrollView>
        {/* The text that user is currently typing */}
        {searchFoodName.length > 0 && (
          <View style={styles.searchHistoryContainer}>
            <TouchableOpacity
              style={styles.searchHistoryBtn}
              onPress={handlePressSearchFood}>
              <MaterialCommunityIcons name="magnify" size={30} />
              <Text style={[styles.foodName, {fontWeight: 'bold'}]}>
                {searchFoodName}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* The list of search history */}
        <Text className="font-bold text-2xl">History</Text>
        {history.map(foodName => (
          <View key={foodName} style={styles.searchHistoryContainer}>
            <TouchableOpacity
              style={styles.searchHistoryBtn}
              onPress={() => {
                setSearchFoodName(foodName);
                handlePressSearchFood();
              }}>
              <MaterialCommunityIcons name="history" size={30} />
              <Text style={styles.foodName}>{foodName}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  foodName: {
    fontSize: 17,
  },
  searchHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  searchHistoryContainer: {
    padding: 7,
    marginBottom: 10,
  },
  parentContainer: {
    marginHorizontal: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  backBtn: {
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,.1)',
    padding: 5,
  },
  searchBar: {
    ...SearchBarStyles.searchBar,
    flex: 1,
  },
});

export default SearchFoodPage;
