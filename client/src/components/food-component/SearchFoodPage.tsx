import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Searchbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native';
import {useEffect, useState} from 'react';
import {SearchBarStyles} from '../../../styles/SearchBarStyles';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import {saveSearchHistory, getSearchHistory} from '../../../utils/file-system';
import {useCustomDialog} from '../../context/CustomDialogContext';
import {useSearchFoodContext} from '../../context/SearchFoodProvider';
import useFood from '../../custom-hook/useFood';
import {FoodStackParamList} from '../../navigation/FoodStack';
import {useAuthContext} from '../../context/AuthProvider';

const SearchFoodPage = ({
  route,
  navigation,
}: NativeStackScreenProps<FoodStackParamList, 'SearchFoodScreen'>) => {
  const {userId} = useAuthContext();
  const [history, setHistory] = useState<string[]>([]);
  const {searchFoodName, setSearchFoodName} = useSearchFoodContext();
  const {handleSearchFood} = useFood();
  const {showDialog} = useCustomDialog();

  const handlePressSearchFood = async (foodToSearch?: string) => {
    let newHistory: string[] = [];
    /* If user did not pass the argument, use the state value */
    foodToSearch = foodToSearch ?? searchFoodName;

    /* Check if the current searched food is in history */
    const foodNameInHistory: string | undefined = history.find(
      historyFoodName => historyFoodName === foodToSearch,
    );

    /* The current searched food in history, remove it and push it in front to simulate a stack*/
    if (foodNameInHistory && foodNameInHistory.length > 0) {
      setHistory(prev => {
        newHistory = prev.filter(prevFoodName => prevFoodName !== foodToSearch);
        newHistory.push(foodToSearch);

        return newHistory;
      });
    } else {
      /* Remove the oldest food name and push the new food name to the top */
      if (history.length >= 10) {
        setHistory(prev => {
          newHistory = [...prev];
          while (newHistory.length >= 10) {
            newHistory.shift();
          }
          newHistory.push(foodToSearch);
          console.log(newHistory);
          return newHistory;
        });
      } else {
        /* Push the food name to the top */
        setHistory(prev => {
          newHistory = [...prev];
          newHistory.push(foodToSearch);
          return newHistory;
        });
      }
    }

    /* Save the new search history to file system */
    saveSearchHistory(newHistory, userId as string);
    /* Query for new food data */
    try {
      await handleSearchFood.mutateAsync(foodToSearch);
    } catch (error: any) {
      if (error.message === 'Not found') {
        showDialog('Error', 'No foods can be found');
      }
    }
    navigation.goBack();
  };

  const handleDeleteHistory = (foodNameToDelete: string) => {
    const filteredFoodToDelete = history.filter(
      prevFoodName => prevFoodName !== foodNameToDelete,
    );
    setHistory(filteredFoodToDelete);
    saveSearchHistory(filteredFoodToDelete, userId as string);
  };

  /* Get all the search history from android file system */
  useEffect(() => {
    const fetchHistory = async () => {
      const returnedHistory = await getSearchHistory(userId as string);
      setHistory(returnedHistory ?? []);
    };
    fetchHistory();
  }, [userId]);

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
          onSubmitEditing={e => handlePressSearchFood(e.nativeEvent.text)}
          onClearIconPress={() => setSearchFoodName('')}
        />
      </View>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* The text that user is currently typing */}
        {searchFoodName.length > 0 && (
          <View style={styles.searchHistoryContainer}>
            <TouchableOpacity
              style={styles.searchHistoryBtn}
              onPress={() => handlePressSearchFood()}>
              <MaterialCommunityIcons name="magnify" size={30} />
              <Text style={[styles.foodName, {fontWeight: 'bold'}]}>
                {searchFoodName}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* The list of search history */}
        <Text className="font-bold text-2xl">History</Text>
        {history
          .slice()
          .reverse()
          .map(foodName => (
            <View key={foodName} style={styles.searchHistoryContainer}>
              {/* Click to search the food name */}
              <TouchableOpacity
                style={styles.searchHistoryBtn}
                onPress={() => {
                  setSearchFoodName(foodName);
                  handlePressSearchFood(foodName);
                }}>
                <MaterialCommunityIcons name="history" size={30} />
                <Text style={styles.foodName}>{foodName}</Text>
              </TouchableOpacity>
              {/* Button to remove the food name */}
              <TouchableOpacity
                style={{marginLeft: 'auto'}}
                onPress={() => handleDeleteHistory(foodName)}>
                <MaterialCommunityIcons name="delete" size={30} />
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
    flexDirection: 'row',
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
