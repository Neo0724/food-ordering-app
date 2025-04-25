import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {EachOrderItemType} from '../context/OrderProvider';
import {ShadowStyle} from '../../styles/ShadowStyle';
export default function EachOrderItem({food}: {food: EachOrderItemType}) {
  return (
    <View>
      <View style={[ShadowStyle.shadowBox, styles.eachOrderFoodContainer]}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderDate}>
            {new Date(food.createTime).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.itemName}>{food.itemName}</Text>
          <View style={styles.quantityPrice}>
            <Text style={styles.quantity}>Quantity: {food.quantity}</Text>
            <Text style={styles.price}>
              RM{(food.quantity * food.price).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.size}>Size: {food.size}</Text>
        </View>
        <Text
          className={`text-sm font-medium 
            ${
              food.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
            }
            `}>
          {food.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  eachOrderFoodContainer: {
    borderRadius: 9,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
    marginBottom: 8,
  },
  quantityPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 15,
    color: '#555',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5282',
  },
  status: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
  },
  statusCompleted: {
    backgroundColor: '#C6F6D5',
    color: '#2F855A',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  size: {
    fontSize: 15,
    color: '#555',
  },
});
