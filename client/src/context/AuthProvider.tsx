import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createSearchHistoryFile,
  createTransactionHistoryFile,
} from '../../utils/file-system';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  isSignedIn: boolean;
  userId: string | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: React.ReactNode}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      createTransactionHistoryFile(userId);
      createSearchHistoryFile(userId);
    }
  }, [userId]);

  useEffect(() => {
    const checkUserSignInStatus = async () => {
      try {
        const storageUserId = await AsyncStorage.getItem('userId');
        if (storageUserId !== null) {
          setIsSignedIn(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkUserSignInStatus();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async newUser => {
      setUser(newUser);
      if (newUser) {
        await AsyncStorage.setItem('userId', newUser.uid);
        setUserId(newUser.uid);
        setIsSignedIn(true);
      } else {
        await AsyncStorage.removeItem('userId');
        setUserId(null);
        setIsSignedIn(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, [initializing]);

  return (
    <AuthContext.Provider value={{user, isSignedIn, userId}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
