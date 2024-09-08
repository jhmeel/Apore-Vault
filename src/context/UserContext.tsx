import React, { createContext, useReducer, ReactNode, useContext, useEffect } from "react";
import { userReducer } from "../reducer";
import { IUserState, IAction } from "../types";

const STORAGE_KEY = 'apore_state';

const getInitialState = (): IUserState => {
  const storedState = localStorage.getItem(STORAGE_KEY);
  if (storedState) {
    return JSON.parse(storedState);
  }
  return {
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
    notificationsEnabled: true,
    holdings: [],
    enabled2F:false,
    portfolioSummary: {
      totalCryptoValue: 0,
      totalFiatValue: 0,
      totalValue: 0,
    },
    transactionHistory: [],
    articles: [],
  };
};

export const UserContext = createContext<{
  state: IUserState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: getInitialState(),
  dispatch: () => null,
});

export const useWallet = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
