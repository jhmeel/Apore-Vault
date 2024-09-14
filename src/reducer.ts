import { IUserState, IAction } from "./types";

export const userReducer = (state: IUserState, action: IAction): IUserState => {
  let newState: IUserState;

  switch (action.type) {
    case "TOGGLE_THEME":
      newState = {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
      window.location.reload();
      break;
    case "DISABLE_NOTIFICATION":
      newState = {
        ...state,
        notificationsEnabled:
          state.notificationsEnabled == false ? true : false,
      };
      break;
    case "CREATE_HOLDINGS":
    case "GET_HOLDINGS":
      newState = {
        ...state,
        holdings: [...state.holdings, ...action.payload],
      };
      break;
    case "GET_PORTFOLIO_SUMMARY":
      newState = {
        ...state,
        portfolioSummary: action.payload,
      };
      break;
    case "GET_TX_HISTORY":
      newState = {
        ...state,
        transactionHistory: [...state.transactionHistory, ...action.payload],
      };
      break;
    case "GET_ARTICLES":
      newState = {
        ...state,
        articles: [...state.articles, ...action.payload],
      };
      break;
    default:
      return state;
  }

  localStorage.setItem("user_state", JSON.stringify(newState));
  return newState;
};
