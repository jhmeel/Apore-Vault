// types.ts
import { DidDht } from '@web5/credentials';
import { Offering, PFI, ExchangeMessage } from '@tbdex/sdk';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Balance {
  [currencyCode: string]: number;
}

export interface User {
  did: string;
  name: string;
  email: string;
  credentials: string[];
}

export interface Exchange {
  id: string;
  offeringId: string;
  pfiDid: string;
  status: 'rfq' | 'quote' | 'order' | 'close';
  payinAmount: number;
  payinCurrency: string;
  payoutAmount?: number;
  payoutCurrency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletState {
  user: User | null;
  balance: Balance;
  pfiList: PFI[];
  offerings: Offering[];
  exchanges: Exchange[];
}

// types.ts (additions)

export interface ExchangeRate {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    timestamp: Date;
  }
  
  export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'exchange';
    amount: number;
    currency: string;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
    description: string;
  }
  
  export interface PFIReputation {
    pfiDid: string;
    averageRating: number;
    totalRatings: number;
    lastUpdated: Date;
  }
  
  // Update WalletState
  export interface WalletState {
    // ... existing properties
    exchangeRates: ExchangeRate[];
    transactions: Transaction[];
    pfiReputations: PFIReputation[];
  }// types.ts (additions)

export type CurrencyType = 'fiat' | 'crypto';

export interface Currency {
  code: string;
  name: string;
  type: CurrencyType;
  symbol: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
}

// Update WalletState
export interface WalletState {
  // ... existing properties
  availableCurrencies: Currency[];
  exchangeRates: ExchangeRate[];
}