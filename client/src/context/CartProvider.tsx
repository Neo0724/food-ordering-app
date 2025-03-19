import {createContext, SetStateAction, useContext, useState} from 'react';

type CardContextType = {
  foodsInCart: FoodCartType[];
  addToCart: (
    newFood: FoodCartType,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
  removeFromCart: (foodId: string, foodSize: string) => void;
  updateQuantity: (
    foodId: string,
    type: 'INCREMENT' | 'DECREMENT',
    foodSize: string,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
};

type FoodCartType = {
  id: string;
  name: string;
  quantity: number;
  size: string;
  price: number;
  availableQuantity: number;
};

const CartContext = createContext<CardContextType>({} as CardContextType);

export function CartProvider({children}: {children: React.ReactNode}) {
  const [cart, setCart] = useState<FoodCartType[] | []>([]);

  const addToCart = (
    newFood: FoodCartType,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    const foodExistsInCart = cart.find(
      food => food.id === newFood.id && food.size === newFood.size,
    );

    if (foodExistsInCart) {
      setCart(prev =>
        prev.map(food => {
          if (food.id === newFood.id && food.size === newFood.size) {
            const exceedQuantity =
              food.quantity + newFood.quantity > food.availableQuantity;
            if (exceedQuantity) {
              setExceedQuantity(true);
            }
            return {
              ...food,
              quantity: exceedQuantity
                ? food.availableQuantity
                : newFood.quantity + food.quantity,
            };
          }
          return food;
        }),
      );
    } else {
      setCart(prev => [...prev, newFood]);
    }
  };

  const removeFromCart = (foodId: string, foodSize: string) => {
    setCart(prev =>
      prev.filter(food => !(food.id === foodId && food.size === foodSize)),
    );
  };

  const updateQuantity = (
    foodId: string,
    type: 'INCREMENT' | 'DECREMENT',
    foodSize: string,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    // Remove the message from user view when user start incrementing or decrementing
    setExceedQuantity(false);
    setCart(prev =>
      prev.map(food => {
        if (food.id === foodId && food.size === foodSize) {
          if (type === 'INCREMENT') {
            const exceedQuantity = food.quantity + 1 > food.availableQuantity;
            if (exceedQuantity) {
              setExceedQuantity(true);
            }
            return {
              ...food,
              quantity: exceedQuantity ? food.quantity : food.quantity + 1,
            };
          } else {
            const exceedMinimum = food.quantity <= 1;
            return {
              ...food,
              quantity: exceedMinimum ? food.quantity : food.quantity - 1,
            };
          }
        }
        return food;
      }),
    );
  };

  return (
    <CartContext.Provider
      value={{foodsInCart: cart, addToCart, removeFromCart, updateQuantity}}>
      {children}
    </CartContext.Provider>
  );
}

export const useCardContext = () => useContext(CartContext);
