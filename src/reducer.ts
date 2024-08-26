import { IUserState, IAction } from './types';

export const userReducer = (state: IUserState, action: IAction): IUserState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    case 'DISABLE_NOTIFICATION':
      return {
        ...state,
        notificationsEnabled: false,
      };
    case 'CREATE_HOLDINGS':
     case 'GET_HOLDINGS':
      return {
        ...state,
        holdings: [...state.holdings, ...action.payload],
      };
      case 'GET_PORTFOLIO_SUMMARY':
      return {
        ...state,
        portfolioSummary: action.payload,
      };
      case 'GET_TX_HISTORY':
      return {
        ...state,
        transactionHistory: [...state.transactionHistory, ...action.payload],
      };
      case 'GET_ARTICLES':
      return {
        ...state,
        articles: [...state.articles, ...action.payload],
      };
    default:
      return state;
  }
};
