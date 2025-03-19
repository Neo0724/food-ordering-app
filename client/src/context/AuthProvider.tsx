import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from '@react-native-firebase/auth';
import React, {createContext, useContext, useEffect, useState} from 'react';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  auth: FirebaseAuthTypes.Module;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const auth = getAuth();

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(
      auth,
      (newUser: FirebaseAuthTypes.User) => {
        setUser(newUser);
        if (initializing) {
          setInitializing(false);
        }
      },
    );
    return subscriber;
  }, [auth, initializing]);

  return (
    <AuthContext.Provider value={{user, auth}}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
