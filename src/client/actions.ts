/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import liquidityProviders from "../liquidityProvider";
import {
  IBlogPost,
  ICustomerCredentialProps,
  IExchangeProps,
  IHolding,
  ILiquidityProvider,
  INotification,
  Ioffering,
  ITransaction,
  ITxStatus,
  MatchingPair,
} from "../types";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import toast from "react-hot-toast";
import localforage from "localforage";
import { useAuth } from "./context/AuthContext";
import { getLiquidityProviderRating } from "./utils";
import { Close } from "@tbdex/http-client";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

export const useUserActions = () => {
  const { state, dispatch } = useContext(UserContext);
  const { userDetails, user } = useAuth();

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });

  const disableNotification = () => dispatch({ type: "DISABLE_NOTIFICATION" });

  const notifyUser = (notification: INotification) => {
    const bc = new BroadcastChannel("EVENTS");
    bc.postMessage({
      type: notification.type,
      message: notification,
    });
  };

  const createHoldings = async (userId: string, holdings: IHolding[]) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      const existingHoldings = userDoc.data()?.holdings || [];

      if (existingHoldings.length > 0) {
        return;
      }

      if (holdings.length > 0) {
        await updateDoc(userDocRef, {
          holdings: arrayUnion(...holdings),
        });

        dispatch({ type: "CREATE_HOLDINGS", payload: holdings });
      }
    } catch (error: any) {
      toast.error(`Error creating holdings: ${error.message}`);
    }
  };

  const getPortfolioSummary = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      const data = userDoc.data();
      const holdings: IHolding[] = data?.holdings || [];

      let totalCryptoValue = 0;
      let totalFiatValue = 0;

      holdings.forEach((holding) => {
        if (holding.type === "Crypto") {
          totalCryptoValue += holding.value ?? 0;
        } else if (holding.type === "Fiat") {
          totalFiatValue += holding.value ?? 0;
        }
      });

      const totalValue = totalCryptoValue + totalFiatValue;

      dispatch({
        type: "GET_PORTFOLIO_SUMMARY",
        payload: {
          totalCryptoValue,
          totalFiatValue,
          totalValue,
        },
      });
    } catch (error: any) {
      toast.error(`Error fetching portfolio summary: ${error.message}`);
    }
  };

  const getTxHistory = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      const data = userDoc.data();
      const txHistory: ITransaction[] = data?.transactionHistory || [];
      return txHistory;
    } catch (error: any) {
      toast.error(`Error getting transactions history:  ${error.message}`);
    }
  };

  const createTxRecord = async (tx: ITransaction) => {
    const userDocRef = doc(db, "users", user?.uid);
    const userDoc = await getDoc(userDocRef);

    const data = userDoc.data();
    const transactionHistory = data?.transactionHistory || [];

    if (transactionHistory.length > 0) {
      await updateDoc(userDocRef, {
        transactionHistory: arrayUnion(tx),
      });
    } else {
      await updateDoc(userDocRef, {
        transactionHistory: [tx],
      });
    }
  };

  const updateTxStatus = async (txRef: string, status: ITxStatus) => {
    const userDocRef = doc(db, "users", user?.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const transactionHistory = data?.transactionHistory || [];

      const updatedTransactionHistory = transactionHistory.map(
        (transaction: ITransaction) => {
          if (transaction.reference === txRef) {
            return {
              ...transaction,
              status,
              updatedAt: new Date(),
            };
          }
          return transaction;
        }
      );

      await updateDoc(userDocRef, {
        transactionHistory: updatedTransactionHistory,
      });
    } else {
      toast.error("User document not found!");
      throw new Error("User document not found!");
    }
  };

  const getArticles = async () => {
    try {
      const articlesCollectionRef = collection(db, "articles");

      const querySnapshot = await getDocs(articlesCollectionRef);

      const articles: IBlogPost[] = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as IBlogPost),
      }));

      dispatch({
        type: "GET_ARTICLES",
        payload: articles,
      });
    } catch (error: any) {
      toast.error(`Error getting articles: ${error.message}`);
    }
  };

  const getHoldings = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      const data = userDoc.data();
      const holdings = data?.holdings || [];

      dispatch({ type: "GET_HOLDINGS", payload: holdings });
    } catch (error: any) {
      toast.error(`Error getting holdings:  ${error.message}`);
    }
  };

  const publishArticle = async (article: IBlogPost) => {
    try {
      const articlesCollectionRef = collection(db, "articles");

      await addDoc(articlesCollectionRef, article);

      toast.success("Article successfully published!");
      await getArticles();
    } catch (error: any) {
      toast.error(`Error publishing article: ${error.message}`);
    }
  };

  const createDID = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.data()?.did) {
        return;
      }
      const { data } = await axiosInstance.post('/createDID');
      await updateDoc(userDocRef, {
        did: data.did,
      });

      console.log("DID successfully created and saved!");
    } catch (error: any) {
      toast.error(`Error creating DID: ${error.message}`);
    }
  };

  const getDID = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      const data = userDoc.data();
      const { data: didData } = await axiosInstance.get('/getDID', { params: { did: data?.did } });
      return didData.did;
    } catch (error: any) {
      toast.error(`Error fetching DID: ${error.message}`);
      return null;
    }
  };

  const getPFIByDID = async (did: string) => {
    return liquidityProviders.find((prov) => prov.did === did);
  };

  const getCredentials = async (credentials: ICustomerCredentialProps) => {
    try {
      const { data } = await axios.get(
        `https://mock-idv.tbddev.org/kcc?name=${credentials.customerName}&country=${credentials.countryCode}&did=${credentials.customerDID}`
      );

      return data;
    } catch (error: any) {
      toast.error(`Error getting credentials: ${error.message}`);
    }
  };

  const findMatchingPairs = async (
    offerings: Ioffering[],
    payIn: string,
    payOut: string
  ): Promise<MatchingPair[]> => {
    return offerings
      .filter(
        (offering) =>
          offering.data.payin.currencyCode === payIn &&
          offering.data.payout.currencyCode === payOut
      )
      .map((offering) => ({
        metadata: offering.metadata,
        payoutUnitsPerPayinUnit: offering.data.payoutUnitsPerPayinUnit,
        payoutCurrency: offering.data.payout.currencyCode,
        payoutMethods: offering.data.payout.methods,
        payinCurrency: offering.data.payin.currencyCode,
        payinMethods: offering.data.payin.methods,
        requiredClaims: offering.data.requiredClaims,
        kind: offering.metadata.kind,
      }));
  };

  const fetchAndCacheOfferings = async () => {
    try {
      for (const provider of liquidityProviders) {
        const { did } = provider;
        const { data: offerings } = await axiosInstance.get('/getOfferings', { params: { pfiDid: did } });
        await localforage.setItem(did, JSON.stringify(offerings));
      }
    } catch (err: any) {
      console.error(`Error fetching and caching offerings: ${err.message}`);
    }
  };

  const getOfferingsByDID = async (
    did: string
  ): Promise<Ioffering[] | null> => {
    try {
      const cachedOfferings = await localforage.getItem<string>(did);
      if (cachedOfferings) {
        return JSON.parse(cachedOfferings) as Ioffering[];
      } else {
        const { data: offerings } = await axiosInstance.get('/getOfferings', { params: { pfiDid: did } });
        await localforage.setItem(did, JSON.stringify(offerings));
        return offerings as Ioffering[];
      }
    } catch (err: any) {
      toast.error(`Error retrieving offerings: ${err.message}`);
      return null;
    }
  };

  const unCacheOfferings = async (did: string) => {
    try {
      await localforage.removeItem(did);
    } catch (err: any) {
      console.error(`Error deleting offerings: ${err.message}`);
    }
  };

  const getAllOfferings = async () => {
    try {
      const offeringsPromises = liquidityProviders.map((provider) =>
        getOfferingsByDID(provider.did)
      );

      const allOfferings = await Promise.all(offeringsPromises);

      return allOfferings;
    } catch (err: any) {
      console.error(`Error getting all offerings: ${err.message}`);
      throw err;
    }
  };

  const removeAllOfferings = async () => {
    try {
      const keys = await localforage.keys();

      const didPattern = /^did:dht:/;
      const didKeys = keys.filter((key) => didPattern.test(key));

      await Promise.all(didKeys.map((key) => localforage.removeItem(key)));

      console.log("All offerings with DID keys have been removed.");
    } catch (err: any) {
      console.error(
        `Error removing all offerings with DID keys: ${err.message}`
      );
    }
  };

  const fetchQuoteFromExchange = async (
    pfiDid: string,
    customerDid: string,
    exchangeId: string
  ) => {
    try {
      const { data: quote } = await axiosInstance.get('/fetchQuote', {
        params: { pfiDid, customerDid, exchangeId }
      });
      return quote;
    } catch (error: any) {
      console.error(`Error fetching quote: ${error.message}`);
      return null;
    }
  };

  const createAndSubmitClose = async (quote: any, reason: string) => {
    try {
      await axiosInstance.post('/createAndSubmitClose', { quote, reason, userDid: userDetails?.did });
    } catch (error: any) {
      console.error(`Error creating and submitting close: ${error.message}`);
    }
  };

  const placeOrder = async (quote: any) => {
    try {
      const { data: order } = await axiosInstance.post('/placeOrder', { quote, userDid: userDetails?.did });
      return order;
    } catch (error: any) {
      console.error(`Error placing order: ${error.message}`);
      throw error;
    }
  };

  const pollOrderStatus = async (order: any, customerDid: string) => {
    try {
      const { data } = await axiosInstance.get('/pollOrderStatus', { params: { order, customerDid } });
      return data.orderStatusUpdate || data.close;
    } catch (error: any) {
      console.error(`Error polling order status: ${error.message}`);
      return null;
    }
  };

  const handleCloseMessage = (close: any) => {
    const success = close.data.success;
    const reason = close.data.reason;

    if (success) {
      toast.success("Order fulfilled successfully");
    } else {
      toast.error(`Order failed: ${reason}`);
    }
  };

  const processOrder = async (customerDid: string, quote: any) => {
    try {
      const order = await placeOrder(quote);
      const orderStatusUpdate = await pollOrderStatus(order, customerDid);

      if (orderStatusUpdate) {
        toast.custom("Order Status Update:", orderStatusUpdate);
      }

      const closeMessage = await pollOrderStatus(order, customerDid);
      if (closeMessage) {
        handleCloseMessage(closeMessage);
      }
    } catch (error: any) {
      toast.error("Error processing order:", error.message);
    }
  };

  const getLiquidityProviders = async (): Promise<
    ILiquidityProvider[] | null
  > => {
    try {
      const providers = await Promise.all(
        liquidityProviders.map(async (provider) => {
          return {
            did: provider.did,
            name: provider.name,
            rating: await getLiquidityProviderRating(provider.did),
            offerings: await getOfferingsByDID(provider.did),
          } as ILiquidityProvider;
        })
      );

      return providers;
    } catch (error: any) {
      toast.error("Error getting liquidity providers:", error.message);
      return null;
    }
  };

  const generateExchangeStatusValues = (exchangeMessage: any) => {
    if (exchangeMessage instanceof Close) {
      if (
        exchangeMessage?.data?.reason?.toLowerCase().includes("complete") ||
        exchangeMessage.data.reason?.toLowerCase().includes("success")
      ) {
        return "completed";
      } else if (
        exchangeMessage.data.reason?.toLowerCase().includes("expired")
      ) {
        return exchangeMessage.data.reason.toLowerCase();
      } else if (
        exchangeMessage.data.reason?.toLowerCase().includes("cancelled")
      ) {
        return "cancelled";
      } else {
        return "failed";
      }
    }
    return exchangeMessage.kind;
  };

  const formatMessages = (exchanges: any) => {
    const formattedMessages = exchanges.map((exchange) => {
      const latestMessage = exchange[exchange.length - 1];
      const rfqMessage = exchange.find((message) => message.kind === "rfq");
      const quoteMessage = exchange.find((message) => message.kind === "quote");
      const status = generateExchangeStatusValues(latestMessage);
      const fee = quoteMessage?.data["payin"]?.["fee"];
      const payinAmount = quoteMessage?.data["payin"]?.["amount"];
      const payoutPaymentDetails =
        rfqMessage.privateData?.payout.paymentDetails;
      return {
        id: latestMessage.metadata.exchangeId,
        payinAmount:
          (fee
            ? Number(payinAmount) + Number(fee)
            : Number(payinAmount)
          ).toString() || rfqMessage.data["payinAmount"],
        payinCurrency: quoteMessage.data["payin"]?.["currencyCode"] ?? null,
        payoutAmount: quoteMessage?.data["payout"]?.["amount"] ?? null,
        payoutCurrency: quoteMessage.data["payout"]?.["currencyCode"],
        status,
        createdTime: rfqMessage.createdAt,
        ...(latestMessage.kind === "quote" && {
          expirationTime: quoteMessage.data["expiresAt"] ?? null,
        }),
        from: "You",
        to:
          payoutPaymentDetails?.address ||
          payoutPaymentDetails?.accountNumber +
            ", " +
            payoutPaymentDetails?.bankName ||
          payoutPaymentDetails?.phoneNumber +
            ", " +
            payoutPaymentDetails?.networkProvider ||
          "Unknown",
        pfiDid: rfqMessage.metadata.to,
      };
    });

    return formattedMessages;
  };

  const fetchExchange = async (pfiDID: string) => {
    try {
      const { data: exchanges } = await axiosInstance.get('/getExchanges', { 
        params: { pfiDid: pfiDID, userDid: userDetails?.did } 
      });
      const mappedExchanges = formatMessages(exchanges);
      return mappedExchanges;
    } catch (error: any) {
      console.error(`Error fetching exchange: ${error.message}`);
      return [];
    }
  };

  const updateExchanges = (newTransactions) => {
    // Implement the logic to update exchanges in your application state
    // This might involve dispatching an action to update the state
    // For example:
    // dispatch({ type: "UPDATE_EXCHANGES", payload: newTransactions });
  };

  const pollExchanges = () => {
    const fetchAllExchanges = async () => {
      console.log("Polling exchanges again...");
      if (!userDetails?.did) return;
      const allExchanges = [];
      try {
        for (const pfi of liquidityProviders) {
          const exchanges = await fetchExchange(pfi.did);
          allExchanges.push(...exchanges);
        }
        console.log("All exchanges:", allExchanges);
        updateExchanges(allExchanges.reverse());
      } catch (error) {
        console.error("Failed to fetch exchanges:", error);
      }
    };

    fetchAllExchanges();
    setInterval(fetchAllExchanges, 5000);
  };

  const createExchange = async (exchangeProps: IExchangeProps) => {
    try {
      await axiosInstance.post('/createExchange', {
        exchangeProps,
        userDid: userDetails?.did
      });
    } catch (error: any) {
      console.error(`Error creating exchange: ${error.message}`);
      throw error;
    }
  };

  return {
    state,
    createExchange,
    toggleTheme,
    processOrder,
    fetchQuoteFromExchange,
    handleCloseMessage,
    fetchAndCacheOfferings,
    getLiquidityProviders,
    pollOrderStatus,
    placeOrder,
    createAndSubmitClose,
    getOfferingsByDID,
    getAllOfferings,
    removeAllOfferings,
    unCacheOfferings,
    getDID,
    getPFIByDID,
    disableNotification,
    getCredentials,
    notifyUser,
    getHoldings,
    createTxRecord,
    updateTxStatus,
    createHoldings,
    createDID,
    publishArticle,
    findMatchingPairs,
    getTxHistory,
    getPortfolioSummary,
    getArticles,
    pollExchanges,
    fetchExchange,
  };
};