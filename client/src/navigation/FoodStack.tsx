import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FoodPage, {Food} from '../components/FoodMenuPage';
import EachFoodPage from '../components/EachFoodPage';
import SearchFoodPage from '../components/SearchFoodPage';

export type FoodStackParamList = {
  FoodListPage: undefined;
  EachFoodPage: {
    food: Food;
  };
  SearchFoodScreen: undefined;
};

const FoodStack = createNativeStackNavigator<FoodStackParamList, 'FoodStack'>();

export default function FoodStackLayout() {
  return (
    <FoodStack.Navigator id="FoodStack" initialRouteName="FoodListPage">
      <FoodStack.Screen
        name="FoodListPage"
        options={{
          title: 'Menu',
        }}
        component={FoodPage}
      />
      <FoodStack.Screen
        name="EachFoodPage"
        options={{
          title: 'Food details',
        }}
        component={EachFoodPage}
      />
      <FoodStack.Screen
        name="SearchFoodScreen"
        options={{
          headerShown: false,
        }}
        component={SearchFoodPage}
      />
    </FoodStack.Navigator>
  );
}
