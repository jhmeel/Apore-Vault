/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import liquidityProviders from "./liquidityProvider";
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
} from "./types";
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
import { BearerDid, DidDht } from "@web5/dids";
import {
  Close,
  Offering,
  Order,
  OrderStatus,
  Quote,
  Rfq,
  TbdexHttpClient,
} from "@tbdex/http-client";
import localforage from "localforage";
import { Jwt, PresentationExchange } from "@web5/credentials";
import { useAuth } from "./context/AuthContext";
import { getLiquidityProviderRating} from "./utils";

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

      // Merge new holdings into the user's document
      if (holdings.length > 0) {
        await updateDoc(userDocRef, {
          holdings: arrayUnion(...holdings),
        });

        // Update the local state
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

      // Aggregate holdings
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

      // Update the state with the fetched holdings
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
      //update local state
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
      const userDid = await DidDht.create({ options: { publish: true } });

      const exportedDid = await userDid.export();
      const did = JSON.stringify(exportedDid);

      await updateDoc(userDocRef, {
        did: did,
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
      return await DidDht.import({ portableDid: JSON.parse(data?.did) });
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
        const offerings = await TbdexHttpClient.getOfferings({ pfiDid: did });
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
        // If not found in cache, refetch
        const offerings = await TbdexHttpClient.getOfferings({ pfiDid: did });
  
        await localforage.setItem(did, JSON.stringify(offerings)); // Cache the new offerings
        return offerings as unknown as Ioffering[];
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

      // Remove all matching keys
      await Promise.all(didKeys.map((key) => localforage.removeItem(key)));

      console.log("All offerings with DID keys have been removed.");
    } catch (err: any) {
      console.error(
        `Error removing all offerings with DID keys: ${err.message}`
      );
    }
  };

  const INITIAL_POLL_INTERVAL_MS = 2000;
  const MAX_ATTEMPTS = 30;

  const fetchQuoteFromExchange = async (
    pfiDid: string,
    customerDid: BearerDid,
    exchangeId: string
  ): Promise<Quote | null> => {
    let quote: Quote | null = null;
    let close: Close | null = null;
    let attempt = 0;
    let pollIntervalMs = INITIAL_POLL_INTERVAL_MS;

    while (!quote && attempt < MAX_ATTEMPTS) {
      try {
        const exchange = await TbdexHttpClient.getExchange({
          pfiDid,
          did: customerDid,
          exchangeId,
        });

        quote = exchange.find((msg) => msg instanceof Quote) as Quote;

        if (!quote) {
          close = exchange.find((msg) => msg instanceof Close) as Close;
          if (close) {
            break;
          } else {
            await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
            pollIntervalMs *= 1.5;
            attempt++;
          }
        }
      } catch (error: any) {
        console.error(`Error fetching exchange: ${error.message}`);
      }
    }

    return quote;
  };

  const createAndSubmitClose = async (quote: Quote, reason: string) => {
    try {
      const close = Close.create({
        metadata: {
          from: userDetails?.did,
          to: quote.metadata.from,
          exchangeId: quote.metadata.exchangeId,
          protocol: "1.0",
        },
        data: { reason },
      });

      await close.sign(userDetails?.did);
      await TbdexHttpClient.submitClose(close);
    } catch (error: any) {
      console.error(`Error creating and submitting close: ${error.message}`);
    }
  };

  const placeOrder = async (quote: Quote): Promise<Order> => {
    try {
      const order = Order.create({
        metadata: {
          from: userDetails?.did,
          to: quote.metadata.from,
          exchangeId: quote.metadata.exchangeId,
          protocol: "1.0",
        },
      });

      await order.sign(userDetails?.did);
      await TbdexHttpClient.submitOrder(order);

      return order;
    } catch (error: any) {
      console.error(`Error placing order: ${error.message}`);
      throw error;
    }
  };

  // Poll for order status updates
  const pollOrderStatus = async (
    order: Order,
    customerDid: BearerDid
  ): Promise<OrderStatus | null> => {
    let orderStatusUpdate: OrderStatus | null = null;
    let close: Close | null = null;
    const MAX_ATTEMPTS = 30;
    let attempt = 0;
    const POLL_INTERVAL_MS = 2000;

    while (!close && attempt < MAX_ATTEMPTS) {
      try {
        const exchange = await TbdexHttpClient.getExchange({
          pfiDid: order.metadata.to,
          did: customerDid,
          exchangeId: order.metadata.exchangeId,
        });

        for (const message of exchange) {
          if (message instanceof OrderStatus) {
            orderStatusUpdate = message;
          } else if (message instanceof Close) {
            close = message;
            break;
          }
        }

        if (!close) {
          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
          attempt++;
        }
      } catch (error: any) {
        console.error(`Error polling order status: ${error.message}`);
      }
    }

    return orderStatusUpdate;
  };
  const handleCloseMessage = (close: Close) => {
    const success = close.data.success;
    const reason = close.data.reason;

    if (success) {
      toast.success("Order fulfilled successfully");
    } else {
      toast.error(`Order failed: ${reason}`);
    }
  };

  // bringing them together
  const processOrder = async (customerDid: BearerDid, quote: Quote) => {
    try {
      const order = await placeOrder(customerDid, quote);
      const orderStatusUpdate = await pollOrderStatus(order, customerDid);

      if (orderStatusUpdate) {
        toast.custom("Order Status Update:", orderStatusUpdate);
      }

      const closeMessage = await pollOrderStatus(order, customerDid);
      if (closeMessage instanceof Close) {
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
      // console.log('quote', quoteMessage)
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
    const exchanges = await TbdexHttpClient.getExchanges({
      pfiDid: pfiDID,
      did: userDetails?.did,
    });
    const mappedExchanges = formatMessages(exchanges);
    return mappedExchanges;
  };

  const updateExchanges = (newTransactions) => {};

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

    // Run the function immediately
    fetchAllExchanges();

    // Set up the interval to run the function periodically
    setInterval(fetchAllExchanges, 5000); // Poll every 5 seconds
  };

  const createExchange = async (exchangeProps: IExchangeProps) => {
    const selectedCredentials = PresentationExchange.selectCredentials({
      vcJwts: exchangeProps.credentials,
      presentationDefinition:
        exchangeProps.selectedOffering.data.requiredClaims,
    });

    const rfq = Rfq.create({
      metadata: {
        to: exchangeProps.selectedOffering.metadata.from,
        from: userDetails?.did,
        protocol: "1.0",
      },
      data: {
        offeringId: exchangeProps.selectedOffering.metadata.id,
        payin: {
          kind: exchangeProps.selectedOffering.data.payin.kind,
          amount: exchangeProps.txPayload.amount,
          paymentDetails: {},
        },
        payout: {
          kind: exchangeProps.selectedOffering.data.payout.kind,
          paymentDetails: {},
        },
        claims: selectedCredentials,
      },
    });

    await rfq.verifyOfferingRequirements(
      exchangeProps.selectedOffering as unknown as Offering
    );

    await rfq.sign(userDetails?.did);

    await TbdexHttpClient.createExchange(rfq);
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
  };
};
