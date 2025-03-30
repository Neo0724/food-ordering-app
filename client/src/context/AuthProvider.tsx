import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {createContext, useContext, useEffect, useState} from 'react';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: React.ReactNode}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user: any) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, [initializing]);

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
