import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import Config from 'react-native-config';

export type Variant = {
  sizeId: number;
  size: string;
  price: number;
  onSale: number;
  quantity: number;
};

export type Food = {
  itemId: number;
  itemName: string;
  itemDescription: string;
  ingredient: string;
  list: Variant[];
  categoryId: number;
  categoryName: string;
};

export default function useFood(searchCriteria = '') {
  const {
    data: allFoods,
    isLoading,
    error,
  } = useQuery<Food[]>({
    queryKey: ['foods'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/inventorys?searchCriteria=${searchCriteria}`,
        );

        if (response.data.code === 1 && response.data.msg === 'success') {
          return response.data.data;
        } else {
          throw new Error('Failed to fetch foods');
        }
      } catch (err) {
        console.log('Error fetching foods, ' + err);
        throw err;
      }
    },
  });

  const handleSearchFood = (query: string) => {
    /* To be completed... */
  };

  return {allFoods, isLoading, error, handleSearchFood};
}
