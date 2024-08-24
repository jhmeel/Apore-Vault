// Wallet.ts
import { Web5 } from '@web5/api';
import { DidDht, PresentationExchange, Jwt } from '@web5/credentials';
import { RFQ, Quote, Order, Close, tbDexSDK } from '@tbdex/sdk';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Currency, Balance, User, Exchange, WalletState } from './types';

class Wallet {
  private web5: any;
  private did: DidDht | null = null;
  private db: any;
  private auth: any;
  public state: WalletState = {
    user: null,
    balance: {},
    pfiList: [],
    offerings: [],
    exchanges: [],
  };

  constructor() {
    const firebaseConfig = {
      // Your Firebase configuration
    };
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.auth = getAuth(app);
  }

  async initialize(): Promise<void> {
    const { web5, did } = await Web5.connect();
    this.web5 = web5;
    this.did = did;
    await this.fetchPFIs();
    console.log('Wallet initialized with DID:', did);
  }
  async fetchExchangeRates(): Promise<void> {
    // In a real application, you would fetch this from an API
    const mockRates: ExchangeRate[] = [
      { fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.85, timestamp: new Date() },
      { fromCurrency: 'USD', toCurrency: 'GBP', rate: 0.72, timestamp: new Date() },
      { fromCurrency: 'USD', toCurrency: 'JPY', rate: 110.5, timestamp: new Date() },
    ];
    this.state.exchangeRates = mockRates;
  }

  async fetchTransactions(): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const q = query(collection(this.db, 'transactions'), where('userId', '==', this.state.user.did));
    const querySnapshot = await getDocs(q);
    this.state.transactions = querySnapshot.docs.map(doc => doc.data() as Transaction);
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const newTransaction = await addDoc(collection(this.db, 'transactions'), {
      ...transaction,
      userId: this.state.user.did,
    });
    this.state.transactions.push({ ...transaction, id: newTransaction.id } as Transaction);
  }

  async fetchPFIReputations(): Promise<void> {
    const q = query(collection(this.db, 'pfiReputations'));
    const querySnapshot = await getDocs(q);
    this.state.pfiReputations = querySnapshot.docs.map(doc => doc.data() as PFIReputation);
  }

  async updatePFIReputation(pfiDid: string, rating: number): Promise<void> {
    const pfiRepRef = doc(this.db, 'pfiReputations', pfiDid);
    const pfiRepDoc = await getDoc(pfiRepRef);
    
    if (pfiRepDoc.exists()) {
      const currentRep = pfiRepDoc.data() as PFIReputation;
      const newTotalRatings = currentRep.totalRatings + 1;
      const newAverageRating = (currentRep.averageRating * currentRep.totalRatings + rating) / newTotalRatings;
      
      await updateDoc(pfiRepRef, {
        averageRating: newAverageRating,
        totalRatings: newTotalRatings,
        lastUpdated: new Date(),
      });
    } else {
      await setDoc(pfiRepRef, {
        pfiDid,
        averageRating: rating,
        totalRatings: 1,
        lastUpdated: new Date(),
      });
    }

    await this.fetchPFIReputations();
  }

  // Update the rateExchange method to also update PFI reputation
  async rateExchange(exchangeId: string, rating: number): Promise<void> {
    await super.rateExchange(exchangeId, rating);
    
    const exchange = this.state.exchanges.find(e => e.id === exchangeId);
    if (exchange) {
      await this.updatePFIReputation(exchange.pfiDid, rating);
    }
  }
  async register(email: string, password: string, name: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user: User = {
      did: this.did!.uri,
      name,
      email,
      credentials: [],
    };
    await setDoc(doc(this.db, 'users', userCredential.user.uid), user);
    this.state.user = user;
  }

  async login(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const userDoc = await getDoc(doc(this.db, 'users', userCredential.user.uid));
    this.state.user = userDoc.data() as User;
    await this.fetchBalance();
    await this.fetchExchanges();
  }

  async fetchBalance(): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const balanceDoc = await getDoc(doc(this.db, 'balances', this.state.user.did));
    this.state.balance = balanceDoc.data() as Balance || {};
  }

  async addFunds(currencyCode: string, amount: number): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const newBalance = (this.state.balance[currencyCode] || 0) + amount;
    await updateDoc(doc(this.db, 'balances', this.state.user.did), {
      [currencyCode]: newBalance,
    });
    this.state.balance[currencyCode] = newBalance;
  }

  async fetchPFIs(): Promise<void> {
    // In a real application, you would fetch this from a tbDEX directory or API
    this.state.pfiList = [
      {
        did: 'did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y',
        name: 'AquaFinance Capital',
        description: 'Offers GHS to USDC, NGN to KES, KES to USD, USD to KES',
      },
      // Add other PFIs here
    ];
  }

  async fetchOfferings(pfiDid: string): Promise<void> {
    try {
      this.state.offerings = await tbDexSDK.getOfferings(pfiDid);
    } catch (error) {
      console.error('Error fetching offerings:', error);
    }
  }

  async getVerifiableCredential(): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const response = await fetch(`https://mock-idv.tbddev.org/kcc?name=${this.state.user.name}&country=US&did=${this.state.user.did}`);
    const credential = await response.text();
    this.state.user.credentials.push(credential);
    await updateDoc(doc(this.db, 'users', this.state.user.did), {
      credentials: this.state.user.credentials,
    });
  }

  async createExchange(offeringId: string, amount: number): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const offering = this.state.offerings.find(o => o.id === offeringId);
    if (!offering) throw new Error('Offering not found');

    try {
      const rfq = await RFQ.create({
        offeringId: offering.id,
        payinAmount: amount.toString(),
        payinMethod: { kind: 'DEBIT_CARD' },
        payoutMethod: { kind: 'BANK_ACCOUNT', accountNumber: '1234567890' },
        claims: this.state.user.credentials,
      });

      const signedRfq = await this.web5.did.sign(rfq);
      const exchange = await tbDexSDK.submitRfq(offering.metadata.from, signedRfq);
      
      const newExchange: Exchange = {
        id: exchange.id,
        offeringId: offering.id,
        pfiDid: offering.metadata.from,
        status: 'rfq',
        payinAmount: amount,
        payinCurrency: offering.data.payin.currencyCode,
        payoutCurrency: offering.data.payout.currencyCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(this.db, 'exchanges'), newExchange);
      this.state.exchanges.push(newExchange);
    } catch (error) {
      console.error('Error creating exchange:', error);
    }
  }

  async acceptQuote(exchangeId: string): Promise<void> {
    const exchange = this.state.exchanges.find(e => e.id === exchangeId);
    if (!exchange || exchange.status !== 'quote') throw new Error('Invalid exchange or status');

    try {
      const order = await Order.create({ quoteId: exchangeId });
      const signedOrder = await this.web5.did.sign(order);
      const updatedExchange = await tbDexSDK.submitOrder(exchange.pfiDid, signedOrder);
      
      await this.updateExchange(exchangeId, {
        status: 'order',
        payoutAmount: parseFloat(updatedExchange.data.payout.amount),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  }

  private async updateExchange(exchangeId: string, update: Partial<Exchange>): Promise<void> {
    const exchangeRef = doc(this.db, 'exchanges', exchangeId);
    await updateDoc(exchangeRef, update);
    
    const index = this.state.exchanges.findIndex(e => e.id === exchangeId);
    if (index !== -1) {
      this.state.exchanges[index] = { ...this.state.exchanges[index], ...update };
    }
  }

  async fetchExchanges(): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const q = query(collection(this.db, 'exchanges'), where('did', '==', this.state.user.did));
    const querySnapshot = await getDocs(q);
    this.state.exchanges = querySnapshot.docs.map(doc => doc.data() as Exchange);
  }

  async rateExchange(exchangeId: string, rating: number): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const exchangeRef = doc(this.db, 'exchanges', exchangeId);
    await updateDoc(exchangeRef, { rating });
    
    const index = this.state.exchanges.findIndex(e => e.id === exchangeId);
    if (index !== -1) {
      this.state.exchanges[index].rating = rating;
    }
  }
}

export default Wallet;

















// Wallet.ts (additions)

import { getMessaging, getToken, onMessage } from "firebase/messaging";

class Wallet {
  private messaging: any;

  constructor() {
    // ... existing constructor code
    this.messaging = getMessaging(app);
  }

  async initialize(): Promise<void> {
    // ... existing initialization code
    await this.initializeNotifications();
    await this.fetchAvailableCurrencies();
    await this.fetchExchangeRates();
  }

  private async initializeNotifications(): Promise<void> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, { vapidKey: 'YOUR_VAPID_KEY' });
        console.log('Notification token:', token);
        
        onMessage(this.messaging, (payload) => {
          console.log('Received message:', payload);
          // Display the notification to the user
          new Notification(payload.notification.title, {
            body: payload.notification.body,
          });
        });
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async fetchAvailableCurrencies(): Promise<void> {
    try {
      // In a real application, you would fetch this from an API
      const currencies: Currency[] = [
        { code: 'USD', name: 'US Dollar', type: 'fiat', symbol: '$' },
        { code: 'EUR', name: 'Euro', type: 'fiat', symbol: '€' },
        { code: 'GBP', name: 'British Pound', type: 'fiat', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', type: 'fiat', symbol: '¥' },
        { code: 'BTC', name: 'Bitcoin', type: 'crypto', symbol: '₿' },
        { code: 'ETH', name: 'Ethereum', type: 'crypto', symbol: 'Ξ' },
        { code: 'XRP', name: 'Ripple', type: 'crypto', symbol: 'XRP' },
      ];
      this.state.availableCurrencies = currencies;
    } catch (error) {
      console.error('Error fetching available currencies:', error);
    }
  }

  async fetchExchangeRates(): Promise<void> {
    try {
      // In a real application, you would fetch this from an API
      const rates: ExchangeRate[] = [];
      const baseCurrencies = ['USD', 'EUR', 'BTC'];
      
      for (const base of baseCurrencies) {
        for (const currency of this.state.availableCurrencies) {
          if (base !== currency.code) {
            rates.push({
              fromCurrency: base,
              toCurrency: currency.code,
              rate: Math.random() * 10, // Mock rate
              timestamp: new Date(),
            });
          }
        }
      }
      
      this.state.exchangeRates = rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  }

  getExchangeRate(fromCurrency: string, toCurrency: string): number | null {
    const rate = this.state.exchangeRates.find(
      r => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency
    );
    return rate ? rate.rate : null;
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number | null> {
    const rate = this.getExchangeRate(fromCurrency, toCurrency);
    return rate ? amount * rate : null;
  }

  async addFunds(currencyCode: string, amount: number): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    const newBalance = (this.state.balance[currencyCode] || 0) + amount;
    await updateDoc(doc(this.db, 'balances', this.state.user.did), {
      [currencyCode]: newBalance,
    });
    this.state.balance[currencyCode] = newBalance;

    // Send notification
    await this.sendNotification('Funds Added', `${amount} ${currencyCode} has been added to your wallet.`);
  }

  async createExchange(offeringId: string, amount: number, fromCurrency: string, toCurrency: string): Promise<void> {
    // ... existing createExchange code

    // Send notification
    await this.sendNotification('Exchange Created', `New exchange created: ${amount} ${fromCurrency} to ${toCurrency}`);
  }

  async sendNotification(title: string, body: string): Promise<void> {
    if (!this.state.user) throw new Error('User not logged in');
    
    // In a real application, you would send this to your server to trigger a Firebase Cloud Message
    console.log('Sending notification:', { title, body });
    
    // For demo purposes, we'll just create a local notification
    new Notification(title, { body });
  }
}