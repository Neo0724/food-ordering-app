import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import {useQueryClient} from '@tanstack/react-query';
import React, {createContext, useContext, useEffect} from 'react';
import Config from 'react-native-config';
import {useAuthContext} from './AuthProvider';

type PointAndCreditBalanceContextType = {
  point: number;
  creditBalance: number;
  isLoading: boolean;
  error: any;
};

const PointAndCreditContext = createContext<PointAndCreditBalanceContextType>(
  {} as PointAndCreditBalanceContextType,
);

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
  } = useQuery({
    queryKey: ['pointAndCreditBalance', user?.uid],
    queryFn: async () => {
      const response = await axios.get(
        `http://${Config.BACKEND_URL}/credits/${user?.uid}`,
      );
      if (response.data.code === 1 && response.data.msg === 'success') {
        return response.data.data;
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
        point: pointAndCreditBalance?.point ?? 0,
        creditBalance: pointAndCreditBalance?.creditBalance ?? 0,
        isLoading,
        error,
      }}>
      {children}
    </PointAndCreditContext.Provider>
  );
}

export const usePointAndCredit = () => useContext(PointAndCreditContext);
