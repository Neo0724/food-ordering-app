import {createContext, SetStateAction, useContext, useState} from 'react';
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
import {Food, Variant} from '../custom-hook/useFood';

type CardContextType = {
  foodsInCart: RetrievedFoodCartType[] | undefined;
  isLoading: boolean;
  error: any;
  addToCartMutation: UseMutationResult<void, Error, NewFoodToAddType, unknown>;
  updateCartQuantityMutation: UseMutationResult<
    void,
    Error,
    UpdateCartQuantityType,
    unknown
  >;
  removeFromCartMutation: UseMutationResult<void, Error, number, unknown>;
  checkFoodInCart: (cartId: number) => void;
  totalPrice: number;
  setTotalPrice: React.Dispatch<SetStateAction<number>>;
  checkedCart: Set<number>;
  setCheckedCart: React.Dispatch<SetStateAction<Set<number>>>;
};

type UpdateCartQuantityType = {
  cartId: number;
  newQuantity: number;
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

export type NewFoodToAddType = {
  itemId: number;
  selectedVariant: Variant;
  selectedQuantity: number;
};

const CartContext = createContext<CardContextType>({} as CardContextType);

export function CartProvider({children}: {children: React.ReactNode}) {
  /* Firebase logged in user */
  const {userId} = useAuthContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [checkedCart, setCheckedCart] = useState<Set<number>>(new Set());

  const queryClient = useQueryClient();

  /* React query for quering user cart item */
  const {
    data: foodsInCart,
    isLoading,
    error,
  } = useQuery<RetrievedFoodCartType[]>({
    queryKey: ['cart-items', userId],
    queryFn: async ({queryKey}): Promise<RetrievedFoodCartType[]> => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/products?userId=${queryKey[1]}`,
        );
        if (response.data.code === 1 && response.data.msg === 'success') {
          const retrievedFoodInCart = response.data
            .data as RetrievedFoodCartType[];
          return retrievedFoodInCart;
        } else {
          return [];
        }
      } catch (err) {
        console.log('Error fetching data, ' + err);
        throw err;
      }
    },
    enabled: !!userId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      itemId,
      selectedQuantity,
      selectedVariant,
    }: NewFoodToAddType) => {
      try {
        if (!itemId) {
          throw Error('Item ID is required');
        }

        if (selectedQuantity <= 0) {
          throw Error('Selected quantity must be greater than 0');
        }

        if (!selectedVariant) {
          throw Error('Size is required');
        }

        await axios.post(`http://${Config.BACKEND_URL}/products`, {
          itemId: itemId,
          userId: userId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart-items', userId]});
    },
  });

  const updateCartQuantityMutation = useMutation({
    mutationFn: async ({newQuantity, cartId}: UpdateCartQuantityType) => {
      try {
        if (newQuantity === undefined) {
          throw Error('Quantity is required');
        }

        if (!cartId) {
          throw Error('Cart ID is required ');
        }

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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart-items', userId]});
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartId: number) => {
      try {
        if (!cartId) {
          throw Error('Cart ID is required');
        }
        await axios.delete(
          `http://${Config.BACKEND_URL}/products?cartId=${cartId}`,
        );
      } catch (err) {
        throw err;
      }
    },
    onError: err => {
      console.log('Error removing food from cart, ' + err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart-items', userId]});
    },
  });

  const checkFoodInCart = (cartId: number) => {
    setCheckedCart(prev => {
      let newCheckedCart = prev;
      if (prev.has(cartId)) {
        newCheckedCart.delete(cartId);
      } else {
        newCheckedCart.add(cartId);
      }

      return newCheckedCart;
    });
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
        totalPrice,
        setTotalPrice,
        checkedCart,
        setCheckedCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
