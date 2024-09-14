/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { IUser } from '../../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  userDetails: IUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDetails: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<IUser| null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user && navigator.onLine) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserDetails(userDoc.data() as IUser);
          }
        } catch (error:any) {
         toast.error(`Error fetching user details: ${error.message}`);
        }
      } else {
        setUserDetails(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userDetails,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};