import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  isSignedIn: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: React.ReactNode}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkUserSignInStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
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
        setIsSignedIn(true);
      } else {
        await AsyncStorage.removeItem('userId');
        setIsSignedIn(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, [initializing]);

  return (
    <AuthContext.Provider value={{user, isSignedIn}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
