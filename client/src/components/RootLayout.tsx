import LandingPage from './LandingPage';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import HomePage from './HomePage';
import {useAuthContext} from '../context/AuthProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FoodDetailsPage from './EachFoodPage';
import FoodPage, {Food} from './FoodPage';
import CartPage from './CartPage';
import OrderPage from './OrderPage';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList, 'RootStack'>();
const FoodStack = createNativeStackNavigator<FoodStackParamList, 'FoodStack'>();

export type RootStackParamList = {
  LandingPage: undefined;
  SignInPage: undefined;
  SignUpPage: undefined;
};

export type FoodStackParamList = {
  FoodListPage: undefined;
  FoodDetailPage: {
    food: Food;
  };
  OrderPage: undefined;
};

export type ButtomTabParamList = {
  HomePage: undefined;
};

function FoodStackList() {
  return (
    <FoodStack.Navigator id="FoodStack">
      <FoodStack.Screen name="FoodListPage" component={FoodPage} />
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
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: '#4A5568',
          tabBarStyle: {
            height: 60,
            paddingVertical: 8,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E2E8F0',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#2D3748',
          },
        })}>
        <Tab.Screen
          name="HomePage"
          component={HomePage}
          options={{
            title: 'Home',
          }}
        />
        <Tab.Screen
          name="FoodPage"
          component={FoodStackList}
          options={{
            title: 'Menu',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="CartPage"
          component={CartPage}
          options={{
            title: 'Cart',
          }}
        />
        <Tab.Screen
          name="OrderPage"
          component={OrderPage}
          options={{
            title: 'Orders',
          }}
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
