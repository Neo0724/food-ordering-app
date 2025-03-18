import LandingPage from './LandingPage';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import HomePage from './HomePage';
import {useAuthContext} from '../context/AuthProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FoodDetailsPage from './FoodDetailsPage';
import FoodPage from './FoodPage';
import {FoodType} from '../sampleData/food';
import CartPage from './CartPage';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList, 'RootStack'>();
const FoodStack = createNativeStackNavigator<FoodStackParamList, 'FoodStack'>();

export type RootStackParamList = {
  LandingPage: undefined;
  SignInPage: undefined;
  SignUpPage: undefined;
};

export type FoodStackParamList = {
  FoodPage: undefined;
  FoodDetailPage: {
    food: FoodType;
  };
};

export type ButtomTabParamList = {
  HomePage: undefined;
};

function FoodStackList() {
  return (
    <FoodStack.Navigator id="FoodStack">
      <FoodStack.Screen name="FoodPage" component={FoodPage} />
      <FoodStack.Screen name="FoodDetailPage" component={FoodDetailsPage} />
    </FoodStack.Navigator>
  );
}

export default function RootLayout() {
  const {user} = useAuthContext();

  if (user) {
    return (
      <Tab.Navigator
        initialRouteName="HomePage"
        screenOptions={({route}) => ({
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="HomePage"
          component={HomePage}
          options={{title: 'Home'}}
        />
        <Tab.Screen
          name="FoodPage"
          component={FoodStackList}
          options={{title: 'Foods', headerShown: false}}
        />
        <Tab.Screen
          name="CartPage"
          component={CartPage}
          options={{title: 'Carts'}}
        />
      </Tab.Navigator>
    );
  } else {
    return (
      <RootStack.Navigator initialRouteName="LandingPage" id="RootStack">
        <RootStack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{title: 'Welcome!'}}
        />
        <RootStack.Screen
          name="SignInPage"
          component={SignInPage}
          options={{title: 'Sign In'}}
        />
        <RootStack.Screen
          name="SignUpPage"
          component={SignUpPage}
          options={{title: 'Sign Up'}}
        />
      </RootStack.Navigator>
    );
  }
}
