import React, { createContext, useReducer, ReactNode, useContext } from "react";
import { userReducer } from "../reducer";
import { IUserState, IAction } from "../types";

const initialState: IUserState = {
  theme: "dark",
  notificationsEnabled: true,
  holdings: [],
  portfolioSummary: {
    totalCryptoValue: 0,
    totalFiatValue: 0,
    totalValue:0
  },
  transactionHistory: [],
  articles: [],
};

export const UserContext = createContext<{
  state: IUserState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useWallet = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};


