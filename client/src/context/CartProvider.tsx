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

type UpdateCartQuantityType = {
  cartId: number;
  unitPrice: number;
  prevQuantity: number;
  newQuantity: number;
};

type RemoveFromCartType = Omit<UpdateCartQuantityType, 'newQuantity'>;

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
  removeFromCartMutation: UseMutationResult<
    void,
    Error,
    RemoveFromCartType,
    unknown
  >;
  setTotalPrice: React.Dispatch<SetStateAction<number>>;
  totalPrice: number;
};

export type RetrievedFoodCartType = {
  userId: number;
  cartId: number;
  itemId: number;
  size: string;
  itemName: string;
  sizeId: number;
  quantity: number;
  availableQuantity: number;
  status: string;
  createdTime: string;
  updatedTime: string;
  price: number;
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
    queryFn: async ({queryKey}) => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/products?userId=${queryKey[1]}`,
        );
        if (response.data.code === 1 && response.data.msg === 'success') {
          const returnedFoodInCart = response.data
            .data as RetrievedFoodCartType[];
          const retrievedTotalPrice = returnedFoodInCart.reduce(
            (acc, food) => acc + food.quantity * food.price,
            0,
          );
          setTotalPrice(retrievedTotalPrice);
          return response.data.data;
        }
      } catch (err) {
        console.log('Error fetching data, ' + err);
      }
    },
    enabled: !!user?.uid,
  });

  /* State */
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const addToCartMutation = useMutation({
    mutationFn: async (newFood: NewFoodToAddType) => {
      setTotalPrice(
        prev => prev + newFood.selectedQuantity * newFood.selectedVariant.price,
      );

      try {
        await axios.post(`http://${Config.BACKEND_URL}/products`, {
          itemId: newFood.itemId,
          userId: user?.uid,
          sizeId: newFood.selectedVariant.sizeId,
          quantity: newFood.selectedQuantity,
        });
      } catch (err) {
        throw err;
      }
    },
    onError: (err, newFood) => {
      console.log('Error adding to cart, ' + err);
      setTotalPrice(
        prev => prev - newFood.selectedQuantity * newFood.selectedVariant.price,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart-items', user?.uid]});
    },
  });

  const updateCartQuantityMutation = useMutation({
    mutationFn: async (foodToUpdate: UpdateCartQuantityType) => {
      try {
        await axios.put(`http://${Config.BACKEND_URL}/products`, {
          itemQuantity: foodToUpdate.newQuantity,
          cartId: foodToUpdate.cartId,
        });
      } catch (err) {
        throw err;
      }
    },
    onError: (err, foodToUpdate) => {
      console.log('Error upating cart quantity, ' + err);
      setTotalPrice(prev =>
        Math.abs(
          prev -
            foodToUpdate.newQuantity * foodToUpdate.unitPrice +
            foodToUpdate.prevQuantity * foodToUpdate.unitPrice,
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart-items', user?.uid]});
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({
      cartId,
      prevQuantity,
      unitPrice,
    }: RemoveFromCartType) => {
      setTotalPrice(prevPrice =>
        Math.abs(prevPrice - prevQuantity * unitPrice),
      );
      try {
        await axios.delete(
          `http://${Config.BACKEND_URL}/products?cartId=${cartId}`,
        );
      } catch (err) {
        throw err;
      }
    },
    onError: (err, foodToRemove) => {
      console.log('Error removing food from cart, ' + err);
      setTotalPrice(prevPrice =>
        Math.abs(
          prevPrice + foodToRemove.prevQuantity * foodToRemove.unitPrice,
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cart-items', user?.uid]});
    },
  });

  return (
    <CartContext.Provider
      value={{
        foodsInCart,
        addToCartMutation,
        updateCartQuantityMutation,
        removeFromCartMutation,
        totalPrice,
        setTotalPrice,
        isLoading,
        error,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCardContext = () => useContext(CartContext);
