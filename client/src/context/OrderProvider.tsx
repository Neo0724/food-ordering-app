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
import {PAYMENT_METHOD, STATUS} from '../constant/constant';

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
  paymentMethod: PAYMENT_METHOD;
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
  const {userId} = useAuthContext();

  /* React query for user order */
  const {
    data: allOrders,
    isLoading,
    error,
  } = useQuery<RetrievedOrdersType[]>({
    queryKey: ['orders', userId],
    queryFn: async ({queryKey}) => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/orders?userId=${queryKey[1]}`,
        );
        if (response.data.code === 1 && response.data.msg === 'success') {
          return response.data.data;
        }
      } catch (err) {
        console.log('Error fetching data, ' + err);
        throw err;
      }
    },
    enabled: !!userId,
  });

  const queryClient = useQueryClient();

  const addOrderMutation = useMutation({
    mutationFn: async ({
      ordersToAdd,
      totalPrice,
      paymentMethod,
    }: AddToOrderType) => {
      try {
        const response = await axios.post(
          `http://${
            Config.BACKEND_URL
          }/orders?totalPrice=${totalPrice}&isPoint=${
            paymentMethod === 'POINT' ? true : false
          }`,
          ordersToAdd,
        );
        if (response.data.code === 1 && response.data.msg === 'success') {
          queryClient.invalidateQueries({queryKey: ['cart-items', userId]});
          return;
        }
        throw new Error('Failed to place order');
      } catch (err) {
        throw err;
      }
    },
    onError: err => {
      console.log('Error from order provider: ' + err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['orders', userId]});
      queryClient.invalidateQueries({
        queryKey: ['pointAndCreditBalance', userId],
      });
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
      console.log('Error from delete order: ' + err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['orders', userId]});
      queryClient.invalidateQueries({
        queryKey: ['pointAndCreditBalance', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['cart-items', userId],
      });
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
