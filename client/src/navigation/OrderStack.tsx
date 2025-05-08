import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OrderPage from '../components/order-component/OrderPage';
import SpecificOrderPage from '../components/order-component/SpecificOrderPage';

export type OrderStackParamList = {
  AllOrderPage: undefined;
  SpecificOrderPage: {
    completedOrderId: string;
  };
};

const OrderStack = createNativeStackNavigator<OrderStackParamList>();

export default function OrderStackLayout() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen
        name="AllOrderPage"
        component={OrderPage}
        options={{
          headerShown: false,
        }}
      />
      <OrderStack.Screen
        name="SpecificOrderPage"
        component={SpecificOrderPage}
        options={{
          headerShown: false,
        }}
      />
    </OrderStack.Navigator>
  );
}
