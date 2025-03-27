import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckoutPage from '../components/CheckoutPage';

export type CheckoutStackParamList = {
  CheckoutPage: undefined;
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
    </CheckoutStack.Navigator>
  );
}
