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

  const topUpCredit = useMutation({
    mutationFn: async (topUpAmount: number) => {
      const response = await axios.get(
        `http://${Config.BACKEND_URL}/credits/${user?.uid}/add?balance=${
          topUpAmount + (pointAndCreditBalance?.balance ?? 0)
        }`,
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
        queryKey: ['pointAndCreditBalance', user?.uid],
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
