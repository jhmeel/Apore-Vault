import { DidDht } from "@web5/dids";
import axios from "axios";
import liquidityProviders from "./liquidityProvider";

export const createUserDID = async () => {
  try {
    const didDht = await DidDht.create({ publish: true });

    const portableDid = didDht.export();
    const did = didDht.uri;
    const didDocument = JSON.stringify(didDht.document);

    return {
      did,
      portableDid,
      didDocument,
    };
  } catch (error) {
    throw error;
  }
};

export const findLiquidityProvider = (
  fromCurrency: string,
  toCurrency: string
) => {
  return liquidityProviders.find((provider) =>
    provider.offerings.includes(`${fromCurrency} to ${toCurrency}`)
  );
};

interface VerifiableCredentialProps {
  customerName: string;
  countryCode: string;
  customerDID: string;
}

export const getVerifiableCredential = async (
  credentials: VerifiableCredentialProps
) => {
  try {
    const { data } = await axios.get(
      `https://mock-idv.tbddev.org/kcc?name=${credentials.customerName}&country=${credentials.countryCode}&did=${credentials.userDID}`
    );
    return data?.credential;
  } catch (error) {
    throw error;
  }
};
