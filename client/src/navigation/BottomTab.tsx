/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Dimensions} from 'react-native';
import HomePage from '../components/HomePage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartPage from '../components/cart-component/CartPage';
import FoodStackLayout, {FoodStackParamList} from './FoodStack';
import TransactionPage from '../components/transaction-component/TransactionPage';
import {NavigatorScreenParams} from '@react-navigation/native';
import OrderStackLayout, {OrderStackParamList} from './OrderStack';

export type BottomTabParamList = {
  HomePage: undefined;
  FoodPage: NavigatorScreenParams<FoodStackParamList>;
  CartPage: undefined;
  OrderStack: NavigatorScreenParams<OrderStackParamList>;
  TransactionPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const WindowHeight = Dimensions.get('window').height;

export default function BottomTabLayout() {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(0,0,0,0.5)',
        tabBarStyle: {
          height: WindowHeight * 0.08,
          backgroundColor: 'rgb(238,167,52)',
          borderTopWidth: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="FoodPage"
        component={FoodStackLayout}
        options={{
          title: 'Menu',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="food" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CartPage"
        component={CartPage}
        options={{
          title: 'Cart',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TransactionPage"
        component={TransactionPage}
        options={{
          title: 'Transaction',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="OrderStack"
        component={OrderStackLayout}
        options={{
          title: 'Orders',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
