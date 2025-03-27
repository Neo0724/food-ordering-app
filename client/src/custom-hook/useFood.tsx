import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import Config from 'react-native-config';

export default function useFood() {
  const {
    data: allFoods,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['foods'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/inventorys`,
        );

        if (response.data.code === 1 && response.data.msg === 'success') {
          return response.data.data;
        } else {
          return null;
        }
      } catch (err) {
        console.log('Error fetching foods, ' + err);
        throw err;
      }
    },
  });

  return {allFoods, isLoading, error};
}
