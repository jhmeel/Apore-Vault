import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { Currency } from './types';

export const formatAmount = (amount: number) => {
  if (Math.abs(amount) >= 1) {
    return amount.toFixed(2);
  }

  const precision = Math.abs(amount) >= 0.01 ? 4 : 6;
  return parseFloat(amount.toFixed(precision)).toString();
};



export interface IHolding {
  id?: string;
  name?: string;
  symbol?: string;
  amount?: number;
  type?: Currency;
  value?: number;
  address?: string;
}

function generateAddress(): string {
  const randomValue = uuidv4();
  const address = CryptoJS.SHA256(randomValue).toString(CryptoJS.enc.Hex).slice(0, 40);
  return `0x${address}`;
}

export const holdings: IHolding[] = [
  {
    id: uuidv4(),
    name: 'US Dollar',
    symbol: 'USD',
    amount: 0,
    type: 'Fiat',
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: 'Euro',
    symbol: 'EUR',
    amount: 0,
    type: 'Fiat',
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: 'British Pound',
    symbol: 'GBP',
    amount: 0,
    type: 'Fiat',
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: 0,
    type: 'Crypto',
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: 'Ghanaian Cedi',
    symbol: 'GHS',
    amount: 0,
    type: 'Fiat',
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: 'Nigerian Naira',
    symbol: 'NGN',
    amount: 0,
    type: 'Fiat',
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: 'Kenyan Shilling',
    symbol: 'KES',
    amount: 0,
    type: 'Fiat',
    value: 0,
    address: generateAddress(),
  },
];


export const formatSettlementTime = (time: number) => {
  if (time < 60) {
    return `${time} minutes`;
  } else {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours} hours, ${minutes} minutes`;
  }
};