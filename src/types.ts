/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILiquidityProvider {
  name?: string;
  did?: string;
  rating?: number;
  offerings?: Ioffering[];
}

export type ITxType = "SEND" | "CONVERT" | "RECEIVE";
export type ITxStatus =  "completed" | "processing" | "failed";
export interface ITransaction {
  reference?: string;
  to?: string;
  from?: string;
  type?: ITxType;
  amount?: string;
  currencyCode?: string;
  timestamp?: any;
  status: ITxStatus;
  narration?: string;
  data?: any;
  metadata?: any;
  liquidityProvider?: string;
}

export interface IBlogPost {
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
  enabled2F?:boolean;
  country: string;
  accessPin?: string;
  holdings?: IHolding[];
  did?: any;
  phoneNumber: string;
  idDocument?: File | null;
}

export enum NoificationType {
  SIGN_UP_SUCCESS = 'Sign up success',
  LOG_IN_SUCCESS = 'Log in success',
  TX_SUCCESS ='Transaction success',
  TX_FAIL = 'Transaction fail',
  EXCHANGE_SUCCESS = 'Exchange success',
  EXCHANGE_FAIL= 'Exchange fail'
  }

export interface INotification {
  id: string;
  type:NoificationType;
  icon?: React.ReactNode;
  title:NoificationType ;
  content: string;
}

export type Currency = "Fiat" | "Crypto";

export interface IHolding {
  id?: string;
  name?: string;
  symbol?: string;
  amount?: number;
  type?: Currency;
  value?: number;
  address?: string;
}

export interface IPortfolioSummary {
  totalCryptoValue: number;
  totalFiatValue: number;
  totalValue: number;
}

export const africanCountries = [
  { name: "Algeria", code: "DZ", flag: "🇩🇿", phoneCode: "213" },
  { name: "Angola", code: "AO", flag: "🇦🇴", phoneCode: "244" },
  { name: "Benin", code: "BJ", flag: "🇧🇯", phoneCode: "229" },
  { name: "Botswana", code: "BW", flag: "🇧🇼", phoneCode: "267" },
  { name: "Burkina Faso", code: "BF", flag: "🇧🇫", phoneCode: "226" },
  { name: "Burundi", code: "BI", flag: "🇧🇮", phoneCode: "257" },
  { name: "Cabo Verde", code: "CV", flag: "🇨🇻", phoneCode: "238" },
  { name: "Cameroon", code: "CM", flag: "🇨🇲", phoneCode: "237" },
  {
    name: "Central African Republic",
    code: "CF",
    flag: "🇨🇫",
    phoneCode: "236",
  },
  { name: "Chad", code: "TD", flag: "🇹🇩", phoneCode: "235" },
  { name: "Comoros", code: "KM", flag: "🇰🇲", phoneCode: "269" },
  {
    name: "Democratic Republic of the Congo",
    code: "CD",
    flag: "🇨🇩",
    phoneCode: "243",
  },
  { name: "Republic of the Congo", code: "CG", flag: "🇨🇬", phoneCode: "242" },
  { name: "Djibouti", code: "DJ", flag: "🇩🇯", phoneCode: "253" },
  { name: "Egypt", code: "EG", flag: "🇪🇬", phoneCode: "20" },
  { name: "Equatorial Guinea", code: "GQ", flag: "🇬🇶", phoneCode: "240" },
  { name: "Eritrea", code: "ER", flag: "🇪🇷", phoneCode: "291" },
  { name: "Eswatini", code: "SZ", flag: "🇸🇿", phoneCode: "268" },
  { name: "Ethiopia", code: "ET", flag: "🇪🇹", phoneCode: "251" },
  { name: "Gabon", code: "GA", flag: "🇬🇦", phoneCode: "241" },
  { name: "Gambia", code: "GM", flag: "🇬🇲", phoneCode: "220" },
  { name: "Ghana", code: "GH", flag: "🇬🇭", phoneCode: "233" },
  { name: "Guinea", code: "GN", flag: "🇬🇳", phoneCode: "224" },
  { name: "Guinea-Bissau", code: "GW", flag: "🇬🇼", phoneCode: "245" },
  { name: "Ivory Coast", code: "CI", flag: "🇨🇮", phoneCode: "225" },
  { name: "Kenya", code: "KE", flag: "🇰🇪", phoneCode: "254" },
  { name: "Lesotho", code: "LS", flag: "🇱🇸", phoneCode: "266" },
  { name: "Liberia", code: "LR", flag: "🇱🇷", phoneCode: "231" },
  { name: "Libya", code: "LY", flag: "🇱🇾", phoneCode: "218" },
  { name: "Madagascar", code: "MG", flag: "🇲🇬", phoneCode: "261" },
  { name: "Malawi", code: "MW", flag: "🇲🇼", phoneCode: "265" },
  { name: "Mali", code: "ML", flag: "🇲🇱", phoneCode: "223" },
  { name: "Mauritania", code: "MR", flag: "🇲🇷", phoneCode: "222" },
  { name: "Mauritius", code: "MU", flag: "🇲🇺", phoneCode: "230" },
  { name: "Morocco", code: "MA", flag: "🇲🇦", phoneCode: "212" },
  { name: "Mozambique", code: "MZ", flag: "🇲🇿", phoneCode: "258" },
  { name: "Namibia", code: "NA", flag: "🇳🇦", phoneCode: "264" },
  { name: "Niger", code: "NE", flag: "🇳🇪", phoneCode: "227" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", phoneCode: "234" },
  { name: "Rwanda", code: "RW", flag: "🇷🇼", phoneCode: "250" },
  { name: "São Tomé and Príncipe", code: "ST", flag: "🇸🇹", phoneCode: "239" },
  { name: "Senegal", code: "SN", flag: "🇸🇳", phoneCode: "221" },
  { name: "Seychelles", code: "SC", flag: "🇸🇨", phoneCode: "248" },
  { name: "Sierra Leone", code: "SL", flag: "🇸🇱", phoneCode: "232" },
  { name: "Somalia", code: "SO", flag: "🇸🇴", phoneCode: "252" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", phoneCode: "27" },
  { name: "South Sudan", code: "SS", flag: "🇸🇸", phoneCode: "211" },
  { name: "Sudan", code: "SD", flag: "🇸🇩", phoneCode: "249" },
  { name: "Tanzania", code: "TZ", flag: "🇹🇿", phoneCode: "255" },
  { name: "Togo", code: "TG", flag: "🇹🇬", phoneCode: "228" },
  { name: "Tunisia", code: "TN", flag: "🇹🇳", phoneCode: "216" },
  { name: "Uganda", code: "UG", flag: "🇺🇬", phoneCode: "256" },
  { name: "Zambia", code: "ZM", flag: "🇿🇲", phoneCode: "260" },
  { name: "Zimbabwe", code: "ZW", flag: "🇿🇼", phoneCode: "263" },
];

export interface IUserState {
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  holdings: IHolding[];
  transactionHistory: ITransaction[];
  articles: IBlogPost[];
  enabled2F: boolean;
  portfolioSummary: IPortfolioSummary;
}

export type IAction =
  | { type: "TOGGLE_THEME" }
  | { type: "DISABLE_NOTIFICATION" }
  | { type: "NOTIFY_USER"; payload: string }
  | { type: "CREATE_HOLDINGS"; payload: IHolding[] }
  | { type: "GET_TX_HISTORY"; payload: ITransaction[] }
  | { type: "GET_PORTFOLIO_SUMMARY"; payload: IPortfolioSummary }
  | { type: "GET_ARTICLES"; payload: IBlogPost[] }
  | { type: "CREATE_TX_RECORD" }
  | { type: "GET_HOLDINGS"; payload: IHolding[] }
  | { type: "GET_LIQUIDITY_PROVIDERS" };

export interface ICustomerCredentialProps {
  customerName: string;
  countryCode: string;
  customerDID: string;
}

export type PaymentMethod = {
  kind: string;
  estimatedSettlementTime?: number;
  requiredPaymentDetails: Record<string, any>;
};

export type InputDescriptor = {
  id: string;
  constraints: {
    fields: {
      path: string[];
      filter: {
        type: string;
        const: string;
      };
    }[];
  };
};

export type RequiredClaims = {
  id: string;
  format: {
    jwt_vc: {
      alg: string[];
    };
  };
  input_descriptors: InputDescriptor[];
};

export type Metadata = {
  from: string;
  protocol: string;
  kind: string;
  id: string;
  createdAt: string;
};

export type OfferingData = {
  description: string;
  payoutUnitsPerPayinUnit: string;
  payout: {
    currencyCode: string;
    kind: string;
    methods: PaymentMethod[];
  };
  payin: {
    currencyCode: string;
    kind: string;
    methods: PaymentMethod[];
  };
  requiredClaims: RequiredClaims;
};

export type Ioffering = {
  metadata: Metadata;
  data: OfferingData;
  signature: string;
};

export type MatchingPair = {
  metadata: Metadata;
  payoutUnitsPerPayinUnit: string;
  payoutCurrency: string;
  payoutMethods: PaymentMethod[];
  payinCurrency: string;
  payinMethods: PaymentMethod[];
  requiredClaims: RequiredClaims;
  kind: string;
};

export interface PaymentInstruction {
  link: string;
  instruction: string;
}

export interface Payin {
  currencyCode: string;
  amount: string;
  fee: string;
  paymentInstruction: PaymentInstruction;
}

export interface Payout {
  currencyCode: string;
  amount: string;
  paymentInstruction: PaymentInstruction;
}

export interface QuoteMetadata {
  exchangeId: string;
  from: string;
  to: string;
  protocol: string;
  kind: string;
  id: string;
  createdAt: string;
}

export interface QuoteData {
  expiresAt: string;
  payin: Payin;
  payout: Payout;
}
export interface ITransactionProps {
  amount: string;
  type: ITxType;
  recipientAddress: string;
}
export interface IExchangeProps {
  selectedOffering: Ioffering;
  credentials: any;
  txPayload: ITransactionProps;
}
