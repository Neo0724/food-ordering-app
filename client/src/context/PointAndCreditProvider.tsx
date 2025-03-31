import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import {useQueryClient} from '@tanstack/react-query';
import React, {createContext, useContext, useEffect} from 'react';
import Config from 'react-native-config';
import {useAuthContext} from './AuthProvider';

type PointAndCreditBalanceContextType = {
  pointBalance: number;
  creditBalance: number;
  isLoading: boolean;
  error: any;
};

const PointAndCreditContext = createContext<PointAndCreditBalanceContextType>(
  {} as PointAndCreditBalanceContextType,
);

type PointAndCreditBalanceReturnType = {
  point: number;
  balance: number;
};

export function PointAndCreditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const {user} = useAuthContext();

  const {
    data: pointAndCreditBalance,
    isLoading,
    error,
  } = useQuery<PointAndCreditBalanceReturnType>({
    queryKey: ['pointAndCreditBalance', user?.uid],
    queryFn: async () => {
      /* Try to get the credit balance */
      const response = await axios.get(
        `http://${Config.BACKEND_URL}/credits/${user?.uid}`,
      );
      if (response.data.code === 1 && response.data.msg === 'success') {
        return response.data.data;
      } else {
        /* User is new, therefore initialize the credit balance */
        const initResponse = await axios.get(
          `http://${Config.BACKEND_URL}/credits?userId=${user?.uid}`,
        );
        if (
          initResponse.data.code === 1 &&
          initResponse.data.msg === 'success'
        ) {
          return initResponse.data.data;
        }
      }
    },
    enabled: !!user?.uid,
  });

  useEffect(() => {
    if (user?.uid) {
      queryClient.invalidateQueries({
        queryKey: ['pointAndCreditBalance', user?.uid],
      });
    }
  }, [queryClient, user?.uid]);

  return (
    <PointAndCreditContext.Provider
      value={{
        pointBalance: pointAndCreditBalance?.point ?? 0,
        creditBalance: pointAndCreditBalance?.balance ?? 0,
        isLoading,
        error,
      }}>
      {children}
    </PointAndCreditContext.Provider>
  );
}

export const usePointAndCredit = () => useContext(PointAndCreditContext);
