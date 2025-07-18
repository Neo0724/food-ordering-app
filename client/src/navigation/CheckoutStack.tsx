import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckoutPage from '../components/checkout-components/CheckoutPage';
import PayAtCounterPage from '../components/checkout-components/PayAtCounterPage';
import PayWithAccountCreditPage from '../components/checkout-components/PayWithAccountCreditPage';
import PayWithPointPage from '../components/checkout-components/PayWithPointPage';

export type CheckoutStackParamList = {
  CheckoutPage: {totalPrice: number};
  PayAtCounterPage: {totalPrice: number};
  PayWithAccountCreditPage: {totalPrice: number};
  PayWithPointPage: {totalPrice: number};
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
        name="PayWithPointPage"
        options={{
          title: 'Pay with Point',
        }}
        component={PayWithPointPage}
      />
      <CheckoutStack.Screen
        name="PayAtCounterPage"
        options={{
          title: 'Pay at Counter',
        }}
        component={PayAtCounterPage}
      />
      <CheckoutStack.Screen
        name="PayWithAccountCreditPage"
        options={{
          title: 'Pay with Credit',
        }}
        component={PayWithAccountCreditPage}
      />
    </CheckoutStack.Navigator>
  );
}
