import {createContext, useContext} from 'react';
import {useAuthContext} from './AuthProvider';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import Config from 'react-native-config';
import {Alert} from 'react-native';
import {STATUS} from '../constant/constant';

export type PlaceOrderType = {
  cartId: number;
  itemId: number;
  sizeId: number;
  quantity: number;
  userId: string;
};

export type EachOrderItemType = Omit<PlaceOrderType, 'userId'> & {
  orderId: string;
  itemName: string;
  size: string;
  price: number;
  createTime: string;
  updateTime: string;
  status: (typeof STATUS)[number];
};

export type RetrievedOrdersType = {
  itemPerOrders: EachOrderItemType[];
  orderId: string;
  status: string;
};

type AddToOrderType = {
  ordersToAdd: PlaceOrderType[];
  totalPrice: number;
};

type OrderContextType = {
  allOrders: RetrievedOrdersType[] | undefined;
  isLoading: boolean;
  error: any;
  addOrderMutation: UseMutationResult<void, Error, AddToOrderType, unknown>;
  deleteOrderMutation: UseMutationResult<void, Error, string, unknown>;
};

const OrderContext = createContext<OrderContextType>({} as OrderContextType);

export function OrderProvider({children}: {children: React.ReactNode}) {
  /* Firebase logged in user */
  const {user} = useAuthContext();

  /* React query for user order */
  const {
    data: allOrders,
    isLoading,
    error,
  } = useQuery<RetrievedOrdersType[]>({
    queryKey: ['orders', user?.uid],
    queryFn: async ({queryKey}) => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/orders?userId=${queryKey[1]}`,
        );
        if (response.data.code === 1 && response.data.msg === 'success') {
          console.log(response.data.data);
          return response.data.data;
        }
      } catch (err) {
        console.log('Error fetching data, ' + err);
        throw err;
      }
    },
    enabled: !!user?.uid,
  });

  const queryClient = useQueryClient();

  const addOrderMutation = useMutation({
    mutationFn: async ({ordersToAdd, totalPrice}: AddToOrderType) => {
      try {
        await axios.post(
          `http://${
            Config.BACKEND_URL
          }/orders?totalPrice=${totalPrice}&isPoint=${false}`,
          ordersToAdd,
        );
      } catch (err) {
        throw err;
      }
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: () => {
      Alert.alert('Order placed successfully');
      queryClient.invalidateQueries({queryKey: ['orders', user?.uid]});
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      try {
        await axios.delete(
          `http://${Config.BACKEND_URL}/orders?orderId=${orderId}`,
        );
      } catch (err) {
        throw err;
      }
    },
    onError: err => {
      console.log(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['orders', user?.uid]});
    },
  });

  return (
    <OrderContext.Provider
      value={{
        allOrders,
        isLoading,
        error,
        addOrderMutation,
        deleteOrderMutation,
      }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => useContext(OrderContext);
