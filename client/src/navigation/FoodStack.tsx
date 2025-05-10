import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Food} from '../custom-hook/useFood';
import FoodMenuPage from '../components/food-component/FoodMenuPage';
import EachFoodPage from '../components/food-component/EachFoodPage';
import SearchFoodPage from '../components/food-component/SearchFoodPage';

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
    <FoodStack.Navigator
      id="FoodStack"
      initialRouteName="FoodListPage"
      screenOptions={{headerShown: false}}>
      <FoodStack.Screen
        name="FoodListPage"
        options={{
          title: 'Menu',
        }}
        component={FoodMenuPage}
      />
      <FoodStack.Screen
        name="EachFoodPage"
        options={{
          title: '',
          headerShown: true,
          headerTransparent: true,
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
