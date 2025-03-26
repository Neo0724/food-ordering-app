import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FoodPage, {Food} from '../components/FoodPage';
import EachFoodPage from '../components/EachFoodPage';

export type FoodStackParamList = {
  FoodListPage: undefined;
  EachFoodPage: {
    food: Food;
  };
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
    </FoodStack.Navigator>
  );
}
