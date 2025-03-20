import {useEffect, useState} from 'react';

export default function useQuantityDebounce(
  newQuantity: number,
  delay: number,
) {
  const [quantity, setQuantity] = useState<number>(newQuantity);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuantity(newQuantity);
    }, delay);

    return () => clearTimeout(handler);
  }, [delay, newQuantity]);

  return quantity;
}
