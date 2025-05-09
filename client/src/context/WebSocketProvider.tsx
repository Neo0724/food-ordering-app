import React, {createContext, useEffect} from 'react';
import {useAuthContext} from './AuthProvider';
import {Easing} from 'react-native';
import {Notifier} from 'react-native-notifier';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../navigation/BottomTab';
import {useQueryClient} from '@tanstack/react-query';

type WebSocketContextType = {};

const WebSocketContext = createContext<WebSocketContextType>(
  {} as WebSocketContextType,
);

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  useEffect(() => {
    const socket = new WebSocket('ws://10.0.2.2:3000');

    socket.onopen = () => {
      console.log('Successfully connected to websocket server');
      socket.send(JSON.stringify({type: 'identify', userId: userId}));
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      const orderId = data.orderId;
      queryClient.invalidateQueries({queryKey: ['orders', userId]});
      Notifier.showNotification({
        title: 'Order Completed!',
        description: `Order with ID: ${orderId} has completed!`,
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onPress: () =>
          navigation.navigate('OrderStack', {
            screen: 'SpecificOrderPage',
            params: {completedOrderId: orderId},
            initial: false,
          }),
        hideOnPress: true,
      });
    };

    socket.onerror = error => {
      console.error('Failed to establish websocket connection:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up on component unmount
    return () => {
      socket.close();
    };
  }, [userId]);
  return (
    <WebSocketContext.Provider value={{}}>{children}</WebSocketContext.Provider>
  );
}
