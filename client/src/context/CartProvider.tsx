import {createContext, SetStateAction, useContext, useState} from 'react';
import {Food, Variant} from '../components/FoodPage';
import Config from 'react-native-config';
import axios from 'axios';
import {useAuthContext} from './AuthProvider';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {STATUS} from '../constant/constant';

type UpdateCartQuantityType = {
  cartId: number;
  newQuantity: number;
};

type RemoveFromCartType = {
  cartId: number;
  unitPrice: number;
  prevQuantity: number;
  isChecked: boolean;
  setTotalPrice: React.Dispatch<SetStateAction<number>>;
};

export type RetrievedFoodCartType = {
  userId: string;
  cartId: number;
  itemId: number;
  size: string;
  itemName: string;
  sizeId: number;
  quantity: number;
  availableQuantity: number;
  status: (typeof STATUS)[number];
  createTime: string;
  updateTime: string;
  price: number;
  isChecked: boolean;
};

type NewFoodToAddTypeWithDialog = NewFoodToAddType & {
  setDialogTitle: React.Dispatch<SetStateAction<string>>;
  setDialogMessage: React.Dispatch<SetStateAction<string>>;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
};

type UpdateCartQuantityTypeWithDialog = UpdateCartQuantityType & {
  setDialogTitle?: React.Dispatch<SetStateAction<string>>;
  setDialogMessage?: React.Dispatch<SetStateAction<string>>;
  setVisible?: React.Dispatch<SetStateAction<boolean>>;
};

type CardContextType = {
  foodsInCart: RetrievedFoodCartType[] | undefined;
  isLoading: boolean;
  error: any;
  addToCartMutation: UseMutationResult<
    void,
    Error,
    NewFoodToAddTypeWithDialog,
    unknown
  >;
  updateCartQuantityMutation: UseMutationResult<
    void,
    Error,
    UpdateCartQuantityTypeWithDialog,
    unknown
  >;
  removeFromCartMutation: UseMutationResult<
    void,
    Error,
    RemoveFromCartType,
    unknown
  >;
  checkFoodInCart: (cartId: number) => void;
};

export type NewFoodToAddType = Omit<
  Food,
  'itemDescription' | 'ingredient' | 'list' | 'itemName'
> & {
  selectedVariant: Variant;
  selectedQuantity: number;
};

const CartContext = createContext<CardContextType>({} as CardContextType);

export function CartProvider({children}: {children: React.ReactNode}) {
  /* Firebase logged in user */
  const {user} = useAuthContext();

  const queryClient = useQueryClient();

  /* React query for quering user cart item */
  const {
    data: foodsInCart,
    isLoading,
    error,
  } = useQuery<RetrievedFoodCartType[]>({
    queryKey: ['cart-items', user?.uid],
    queryFn: async ({queryKey}): Promise<RetrievedFoodCartType[]> => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/products?userId=${queryKey[1]}`,
        );
        if (response.data.code === 1 && response.data.msg === 'success') {
          const retrievedFoodInCart = response.data
            .data as RetrievedFoodCartType[];
          return retrievedFoodInCart.map(food => ({
            ...food,
            isChecked: false,
          }));
        } else {
          return [];
        }
      } catch (err) {
        console.log('Error fetching data, ' + err);
        throw err;
      }
    },
    enabled: !!user?.uid,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      itemId,
      selectedQuantity,
      selectedVariant,
    }: NewFoodToAddTypeWithDialog) => {
      try {
        await axios.post(`http://${Config.BACKEND_URL}/products`, {
          itemId: itemId,
          userId: user?.uid,
          sizeId: selectedVariant.sizeId,
          quantity: selectedQuantity,
        });
      } catch (err) {
        throw err;
      }
    },
    onError: err => {
      console.log('Error adding to cart, ' + err);
    },
    onSuccess: (_, {setDialogTitle, setDialogMessage, setVisible}) => {
      setDialogTitle('Success');
      setDialogMessage('Food added to cart');
      setVisible(true);
      queryClient.invalidateQueries({queryKey: ['cart-items', user?.uid]});
    },
  });

  const updateCartQuantityMutation = useMutation({
    mutationFn: async ({
      newQuantity,
      cartId,
    }: UpdateCartQuantityTypeWithDialog) => {
      try {
        await axios.put(`http://${Config.BACKEND_URL}/products`, {
          itemQuantity: newQuantity,
          cartId: cartId,
        });
      } catch (err) {
        throw err;
      }
    },
    onError: err => {
      console.log('Error upating cart quantity, ' + err);
    },
    onSuccess: (_, {setDialogTitle, setDialogMessage, setVisible}) => {
      setDialogTitle && setDialogTitle('Success');
      setDialogMessage && setDialogMessage('Cart quantity updated');
      setVisible && setVisible(true);
      queryClient.invalidateQueries({queryKey: ['cart-items', user?.uid]});
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({cartId}: RemoveFromCartType) => {
      try {
        await axios.delete(
          `http://${Config.BACKEND_URL}/products?cartId=${cartId}`,
        );
      } catch (err) {
        throw err;
      }
    },
    onError: (err, {isChecked, unitPrice, prevQuantity, setTotalPrice}) => {
      console.log('Error removing food from cart, ' + err);
      isChecked && setTotalPrice(prev => prev + unitPrice * prevQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart-items', user?.uid]});
    },
  });

  const checkFoodInCart = (cartId: number) => {
    queryClient.setQueryData<RetrievedFoodCartType[]>(
      ['cart-items', user?.uid],
      (prevCartItem: RetrievedFoodCartType[] | undefined) => {
        return prevCartItem?.map(cartItem => {
          if (cartItem.cartId === cartId) {
            return {
              ...cartItem,
              isChecked: !cartItem.isChecked,
            };
          } else {
            return cartItem;
          }
        });
      },
    );
  };

  return (
    <CartContext.Provider
      value={{
        foodsInCart,
        addToCartMutation,
        updateCartQuantityMutation,
        removeFromCartMutation,
        isLoading,
        error,
        checkFoodInCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
