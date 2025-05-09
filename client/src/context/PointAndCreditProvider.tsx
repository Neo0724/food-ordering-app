import axios from 'axios';
import {useMutation, UseMutationResult, useQuery} from '@tanstack/react-query';
import {useQueryClient} from '@tanstack/react-query';
import React, {createContext, useContext} from 'react';
import Config from 'react-native-config';
import {useAuthContext} from './AuthProvider';

type PointAndCreditBalanceContextType = {
  pointBalance: number;
  creditBalance: number;
  isLoading: boolean;
  error: any;
  topUpCredit: UseMutationResult<void, Error, number, unknown>;
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

  const {userId} = useAuthContext();

  const {
    data: pointAndCreditBalance,
    isLoading,
    error,
  } = useQuery<PointAndCreditBalanceReturnType>({
    queryKey: ['pointAndCreditBalance', userId],
    queryFn: async () => {
      /* Try to get the credit balance */
      try {
        const response = await axios.get(
          `http://${Config.BACKEND_URL}/credits/${userId}`,
        );
        if (response.data.code === 1 && response.data.msg === 'success') {
          return response.data.data;
        }
      } catch (err) {
        /* User is new, therefore initialize the credit balance */
        const initResponse = await axios.get(
          `http://${Config.BACKEND_URL}/credits?userId=${userId}`,
        );
        if (
          initResponse.data.code === 1 &&
          initResponse.data.msg === 'success'
        ) {
          return initResponse.data.data;
        }
      }
    },
    enabled: !!userId,
  });

  const topUpCredit = useMutation({
    mutationFn: async (topUpAmount: number) => {
      const response = await axios.get(
        `http://${Config.BACKEND_URL}/credits/${userId}/add?balance=${topUpAmount}`,
      );
      if (response.data.code !== 1) {
        throw new Error(response.data.msg);
      }
    },
    onError: error => {
      console.log('Error top up to current balance ', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pointAndCreditBalance', userId],
      });
    },
  });

  return (
    <PointAndCreditContext.Provider
      value={{
        pointBalance: pointAndCreditBalance?.point ?? 0,
        creditBalance: pointAndCreditBalance?.balance ?? 0,
        isLoading,
        error,
        topUpCredit,
      }}>
      {children}
    </PointAndCreditContext.Provider>
  );
}

export const usePointAndCredit = () => useContext(PointAndCreditContext);
