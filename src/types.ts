export interface Ioffering {
  id?: string;
  description?: string;
  exchangeRate?: string;
  settlementTime?: number;
  fee?: number;
  payin?: {
    currencyCode: string;
  };
  payout?: {
    currencyCode: string;
  };
  requiredClaims?: {};
}

export interface ILiquidityProvider {
  name?: string;
  did?: string;
  rating?: number;
  offerings: Ioffering[];
}

export type ITxType = "SEND" | "CONVERT" | "RECEIVE";

export interface ITransaction {
  id?: string;
  from?: string;
  to?: string;
  type?: ITxType;
  amount?: number;
  currencyCode?: string;
  timestamp?: Date;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  data?: any;
  metadata?: any;
  liquidityProvider?: ILiquidityProvider;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
}

export interface IUser {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  dateOfBirth: string;
  country: string;
  phoneNumber: string;
  idDocument: File | null;
}