import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { IHolding, Ioffering } from "./types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import BigNumber from 'bignumber.js'

export const formatAmount = (amount: number) => {
  if (Math.abs(amount) >= 1) {
    return amount.toFixed(2);
  }

  const precision = Math.abs(amount) >= 0.01 ? 4 : 6;
  return parseFloat(amount.toFixed(precision)).toString();
};

function generateAddress(): string {
  const randomValue = uuidv4();
  const address = CryptoJS.SHA256(randomValue)
    .toString(CryptoJS.enc.Hex)
    .slice(0, 40);
  return `0x${address}`;
}

export const holdings: IHolding[] = [
  {
    id: uuidv4(),
    name: "US Dollar",
    symbol: "USD",
    amount: 0,
    type: "Fiat",
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: "Euro",
    symbol: "EUR",
    amount: 0,
    type: "Fiat",
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: "British Pound",
    symbol: "GBP",
    amount: 0,
    type: "Fiat",
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0,
    type: "Crypto",
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: "Ghanaian Cedi",
    symbol: "GHS",
    amount: 0,
    type: "Fiat",
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: "Nigerian Naira",
    symbol: "NGN",
    amount: 0,
    type: "Fiat",
    value: 0,
    address: generateAddress(),
  },
  {
    id: uuidv4(),
    name: "Kenyan Shilling",
    symbol: "KES",
    amount: 0,
    type: "Fiat",
    value: 0,
    address: generateAddress(),
  },
];

export const formatSettlementTime = (time?: number) => {
  if (!time) return 0;

  if (time < 60) {
    return `${time} minutes`;
  } else {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours} hours, ${minutes} minutes`;
  }
};

export const getExchangeAmount = (amount: string, offering: Ioffering) => {
  const exchAmout =
    parseFloat(amount) * parseFloat(offering?.data.payoutUnitsPerPayinUnit);
  return exchAmout.toFixed(2);
};

export const getLiquidityProviderRating = async (
  liquidityProviderId: string
): Promise<number | null> => {
  try {
    const lpDocRef = doc(db, "liquidityProviders", liquidityProviderId);
    const lpDoc = await getDoc(lpDocRef);

    if (lpDoc.exists()) {
      const data = lpDoc.data();
      if (data.averageRating !== undefined && data.totalRatings !== undefined) {
        return data.averageRating;
      } else {
        return 0;
      }
    }
    return 0;
  } catch (error) {
    console.error("Error getting liquidity provider rating:", error);
    throw error;
  }
};

interface TransactionFeeParams {
  transactionAmount: string;  // The transaction amount 
  payin: string;              // The currency in which payment is made
  payout: string;             // The currency in which the recipient receives payment
  exchangeRate: string;       // Exchange rate between payin and payout currencies
}

interface FeeStructure {
  fixedFee: number;           // Flat fee added to every transaction
  percentageFee: number;      // Percentage of the transaction amount added as a fee
  exchangeRateMargin: number; // Margin applied to the exchange rate (e.g., 1% fee on conversion)
}

class TransactionFeeCalculator {
  private feeStructure: FeeStructure;


  constructor(feeStructure: FeeStructure) {
    this.feeStructure = feeStructure;
  }

  
  private validateParams(params: TransactionFeeParams) {
    const { transactionAmount, exchangeRate } = params;

    
    const amount = new BigNumber(transactionAmount);
    if (amount.isNaN() || amount.lte(0)) {
      throw new Error('Invalid transaction amount: Must be a positive number');
    }

    if (Number(exchangeRate) <= 0) {
      throw new Error('Invalid exchange rate: Must be greater than zero');
    }

    return amount;
  }

  
  public calculateTransactionFee(params: TransactionFeeParams): BigNumber {
    const { payin, payout, exchangeRate } = params;
    const amount = this.validateParams(params);


    const percentageFeeAmount = amount.multipliedBy(this.feeStructure.percentageFee);

   
    const totalBaseAmount = amount.plus(this.feeStructure.fixedFee).plus(percentageFeeAmount);

  
    let totalAmount = totalBaseAmount;
    if (payin !== payout) {
      const adjustedExchangeRate = Number(exchangeRate) * (1 - this.feeStructure.exchangeRateMargin); // Apply the margin
      totalAmount = totalBaseAmount.multipliedBy(adjustedExchangeRate);
    }

    return totalAmount; 
  }
}


const feeStructure: FeeStructure = {
  fixedFee: 0.5,              // fixed fee (0.50) of payin
  percentageFee: 0.01,        //  percentage fee (e.g., 1%)
  exchangeRateMargin: 0.005,  // exchange rate margin (e.g., 0.5%)
};
export const transactionFeeCalculator = new TransactionFeeCalculator(feeStructure);
