import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {useOrderContext} from '../../context/OrderProvider';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OrderStackParamList} from '../../navigation/OrderStack';
import {ShadowStyle} from '../../../styles/ShadowStyle';
import EachOrderItem from './EachOrderItem';

type SpecificOrderProps = NativeStackScreenProps<
  OrderStackParamList,
  'SpecificOrderPage'
>;

const SpecificOrderPage = ({route, navigation}: SpecificOrderProps) => {
  const completedOrderId = route.params.completedOrderId;
  const {allOrders, isLoading, error} = useOrderContext();

  const completedOrders = allOrders?.filter(
    order => order.orderId === completedOrderId,
  );

  return (
    <View className="mx-2 flex-1">
      {isLoading && (
        /* Loading indicator */
        <View className="my-auto gap-y-2 justify-center items-center">
          <Text className="text-lg font-medium text-gray-600">
            Loading orders ...
          </Text>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
      {error && <Text className="my-auto">Error: {error.message}</Text>}
      {allOrders?.length === 0 && <Text className="mt-3">No orders found</Text>}
      {!isLoading && !error && completedOrders?.length !== 0 && (
        <>
          <ScrollView
            contentContainerStyle={{
              rowGap: 10,
              marginVertical: 10,
            }}>
            {completedOrders?.map(order => (
              <View
                key={order.orderId}
                style={[ShadowStyle.shadowBox, styles.orderContainer]}>
                <Text className="text-xl font-bold">
                  Order ID: #{order.orderId}
                </Text>
                <View>
                  {order.itemPerOrders.map(food => (
                    <EachOrderItem
                      key={
                        food.cartId.toString() +
                        food.orderId +
                        food.sizeId.toString()
                      }
                      food={food}
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    marginVertical: 4,
    marginHorizontal: 5,
    backgroundColor: '#f4f5f5',
    borderRadius: 11,
    padding: 13,
  },
});
export default SpecificOrderPage;
