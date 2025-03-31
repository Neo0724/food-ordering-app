/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Dimensions} from 'react-native';
import HomePage from '../components/HomePage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartPage from '../components/cart-component/CartPage';
import OrderPage from '../components/OrderPage';
import FoodStackLayout from './FoodStack';

export type BottomTabParamList = {
  HomePage: undefined;
  FoodPage: undefined;
  CartPage: undefined;
  OrderPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList, 'BottomTab'>();
const WindowHeight = Dimensions.get('window').height;

export default function BottomTabLayout() {
  return (
    <Tab.Navigator
      id="BottomTab"
      initialRouteName="HomePage"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(0,0,0,0.5)',
        tabBarStyle: {
          height: WindowHeight * 0.08,
          backgroundColor: 'rgb(238,167,52)',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 16,
        },
        headerStyle: {
          backgroundColor: 'white',
          elevation: 5,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
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
          headerShown: false,
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
        name="OrderPage"
        component={OrderPage}
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
