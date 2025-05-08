import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
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

export default function useFood(query = '') {
  const queryClient = useQueryClient();

  const {
    data: allFoods,
    isLoading,
    error,
  } = useQuery<Food[]>({
    queryKey: ['foods'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/inventorys?searchCriteria=${query}`,
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

  const handleSearchFood = useMutation({
    mutationFn: async (searchQuery: string) => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/inventorys?searchCriteria=${searchQuery}`,
        );

        if (response.data.code === 1 && response.data.msg === 'success') {
          queryClient.setQueryData(['foods'], response.data.data);
        } else if (
          (response.data.msg as String).toString().match('.*No items found.*')
        ) {
          throw new Error('Not found');
        } else {
          throw new Error('Failed to fetch foods');
        }
      } catch (err) {
        throw err;
      }
    },
    onError: err => {
      queryClient.setQueryData(['foods'], []);
      console.log(err.message);
    },
  });

  return {allFoods, isLoading, error, handleSearchFood};
}
