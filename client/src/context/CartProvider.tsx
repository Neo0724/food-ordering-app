import {createContext, SetStateAction, useContext, useState} from 'react';
import {Food, Variant} from '../components/FoodPage';

type CardContextType = {
  foodsInCart: FoodCartType[];
  addToCart: (
    newFood: FoodCartType,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
  removeFromCart: (foodId: number, sizeId: number) => void;
  updateQuantity: (
    foodId: number,
    type: 'INCREMENT' | 'DECREMENT',
    sizeId: number,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
  totalPrice: number;
};

export type FoodCartType = Omit<
  Food,
  'itemDescription' | 'ingredient' | 'list'
> & {
  selectedVariant: Variant;
  selectedQuantity: number;
};

const CartContext = createContext<CardContextType>({} as CardContextType);

export function CartProvider({children}: {children: React.ReactNode}) {
  const [cart, setCart] = useState<FoodCartType[] | []>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const addToCart = (
    newFood: FoodCartType,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    const foodExistsInCart = cart.find(
      food =>
        food.itemId === newFood.itemId &&
        food.selectedVariant.sizeId === newFood.selectedVariant.sizeId,
    );

    if (!foodExistsInCart) {
      setTotalPrice(
        prev => prev + newFood.selectedQuantity * newFood.selectedVariant.price,
      );
      setCart(prev => [...prev, newFood]);
    } else {
      let newTotalPrice = totalPrice;
      let updatedCart = cart.map(food => {
        if (
          food.itemId === newFood.itemId &&
          food.selectedVariant.sizeId === newFood.selectedVariant.sizeId
        ) {
          const exceededMaxQuantity =
            food.selectedQuantity + newFood.selectedQuantity >
            food.selectedVariant.quantity;

          if (exceededMaxQuantity) {
            newTotalPrice = Math.abs(
              newTotalPrice -
                food.selectedQuantity * food.selectedVariant.price +
                newFood.selectedQuantity * newFood.selectedVariant.price,
            );
            setExceedQuantity(true);
          } else {
            newTotalPrice +=
              newFood.selectedQuantity * newFood.selectedVariant.price;
          }

          return {
            ...food,
            selectedQuantity: exceededMaxQuantity
              ? food.selectedQuantity
              : food.selectedQuantity + newFood.selectedQuantity,
          };
        } else {
          return food;
        }
      });

      setCart(updatedCart);
      setTotalPrice(newTotalPrice);
    }
  };

  const removeFromCart = (foodId: number, sizeId: number) => {
    setCart(prev => {
      const foodToRemove = prev.find(
        food =>
          food.itemId === foodId && food.selectedVariant.sizeId === sizeId,
      );

      if (foodToRemove) {
        setTotalPrice(prevPrice =>
          Math.abs(
            prevPrice -
              foodToRemove.selectedQuantity *
                foodToRemove.selectedVariant.price,
          ),
        );
      }

      return prev.filter(
        food =>
          !(foodId === food.itemId && sizeId === food.selectedVariant.sizeId),
      );
    });
  };

  const updateQuantity = (
    foodId: number,
    type: 'INCREMENT' | 'DECREMENT',
    sizeId: number,
    setExceedQuantity: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    // Remove the message from user view when user start incrementing or decrementing
    setExceedQuantity(false);
    setCart(prev => {
      return prev.map(food => {
        if (food.itemId === foodId && food.selectedVariant.sizeId === sizeId) {
          if (type === 'INCREMENT') {
            const exceededMaxQuantity =
              food.selectedQuantity + 1 > food.selectedVariant.quantity;

            if (exceededMaxQuantity) {
              setExceedQuantity(true);
            } else {
              setTotalPrice(
                prevPrice => prevPrice + food.selectedVariant.price,
              );
            }
            return {
              ...food,
              selectedQuantity: exceededMaxQuantity
                ? food.selectedQuantity
                : food.selectedQuantity + 1,
            };
          } else {
            const exceededMinQuantity = food.selectedQuantity <= 1;
            if (exceededMinQuantity) {
              setExceedQuantity(true);
            } else {
              setTotalPrice(
                prevPrice => prevPrice - food.selectedVariant.price,
              );
            }
            return {
              ...food,
              selectedQuantity: exceededMinQuantity
                ? 1
                : food.selectedQuantity - 1,
            };
          }
        } else {
          return food;
        }
      });
    });
  };

  return (
    <CartContext.Provider
      value={{
        foodsInCart: cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCardContext = () => useContext(CartContext);
