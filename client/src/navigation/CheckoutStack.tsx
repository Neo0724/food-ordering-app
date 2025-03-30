import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckoutPage from '../components/CheckoutPage';
import PayAtCounterPage from '../components/PayAtCounterPage';

export type CheckoutStackParamList = {
  CheckoutPage: {totalPrice: number};
  PayAtCounterPage: undefined;
};

const CheckoutStack = createNativeStackNavigator<CheckoutStackParamList>();

export default function CheckoutStackLayout() {
  return (
    <CheckoutStack.Navigator initialRouteName="CheckoutPage">
      <CheckoutStack.Screen
        name="CheckoutPage"
        options={{
          title: 'Checkout',
        }}
        component={CheckoutPage}
      />
      <CheckoutStack.Screen
        name="PayAtCounterPage"
        options={{
          title: 'Pay at Counter',
        }}
        component={PayAtCounterPage}
      />
    </CheckoutStack.Navigator>
  );
}
