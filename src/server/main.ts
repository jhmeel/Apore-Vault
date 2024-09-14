import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { BearerDid, DidDht, PortableDid } from "@web5/dids";
import {
  Close,
  Offering,
  Order,
  OrderStatus,
  Quote,
  Rfq,
  TbdexHttpClient,
} from "@tbdex/http-client";
import { PresentationExchange } from "@web5/credentials";
import { IExchangeProps, Ioffering, MatchingPair } from "../types.js";

const app = express();
const port = 3000;

app.use(express.json());

app.post('/createDID', async (req: Request, res: Response) => {
  try {
    const userDid = await DidDht.create({ options: { publish: true } });
    const exportedDid = await userDid.export();
    res.json({ did: JSON.stringify(exportedDid) });
  } catch (error: unknown) {
    res.status(500).json({ error: `Error creating DID: ${(error as Error).message}` });
  }
});

app.get('/getDID', async (req: Request, res: Response) => {
  try {
    const { did } = req.query;
    if (typeof did !== 'string') {
      throw new Error('Invalid DID provided');
    }
    const importedDid = await DidDht.import({ portableDid: JSON.parse(did) as PortableDid });
    res.json({ did: importedDid });
  } catch (error: unknown) {
    res.status(500).json({ error: `Error fetching DID: ${(error as Error).message}` });
  }
});

app.get('/getOfferings', async (req: Request, res: Response) => {
  try {
    const { pfiDid } = req.query;
    if (typeof pfiDid !== 'string') {
      throw new Error('Invalid PFI DID provided');
    }
    const offerings = await TbdexHttpClient.getOfferings({ pfiDid });
    res.json(offerings);
  } catch (error: unknown) {
    res.status(500).json({ error: `Error retrieving offerings: ${(error as Error).message}` });
  }
});

app.post('/createExchange', async (req: Request, res: Response) => {
  try {
    const { exchangeProps, userDid } = req.body as { exchangeProps: IExchangeProps; userDid: BearerDid };
    const selectedCredentials = PresentationExchange.selectCredentials({
      vcJwts: exchangeProps.credentials,
      presentationDefinition: exchangeProps.selectedOffering.data.requiredClaims,
    });

    const rfq = Rfq.create({
      metadata: {
        to: exchangeProps.selectedOffering.metadata.from,
        from: userDid,
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

    await rfq.verifyOfferingRequirements(exchangeProps.selectedOffering as unknown as Offering);
    await rfq.sign(userDid);
    await TbdexHttpClient.createExchange(rfq);

    res.json({ success: true });
  } catch (error: unknown) {
    res.status(500).json({ error: `Error creating exchange: ${(error as Error).message}` });
  }
});

app.get('/fetchQuote', async (req: Request, res: Response) => {
  try {
    const { pfiDid, customerDid, exchangeId } = req.query;
    if (typeof pfiDid !== 'string' || typeof customerDid !== 'string' || typeof exchangeId !== 'string') {
      throw new Error('Invalid parameters provided');
    }
    const exchange = await TbdexHttpClient.getExchange({
      pfiDid,
      did: customerDid as unknown as BearerDid,
      exchangeId,
    });

    const quote = exchange.find((msg) => msg instanceof Quote) as Quote | undefined;
    if (!quote) {
      throw new Error('Quote not found');
    }
    res.json(quote);
  } catch (error: unknown) {
    res.status(500).json({ error: `Error fetching quote: ${(error as Error).message}` });
  }
});

app.post('/placeOrder', async (req: Request, res: Response) => {
  try {
    const { quote, userDid } = req.body as { quote: Quote; userDid: BearerDid };
    const order = Order.create({
      metadata: {
        from: userDid,
        to: quote.metadata.from,
        exchangeId: quote.metadata.exchangeId,
        protocol: "1.0",
      },
    });

    await order.sign(userDid);
    await TbdexHttpClient.submitOrder(order);

    res.json(order);
  } catch (error: unknown) {
    res.status(500).json({ error: `Error placing order: ${(error as Error).message}` });
  }
});

app.get('/pollOrderStatus', async (req: Request, res: Response) => {
  try {
    const { order, customerDid } = req.query;
    if (typeof order !== 'object' || typeof customerDid !== 'string') {
      throw new Error('Invalid parameters provided');
    }
    const exchange = await TbdexHttpClient.getExchange({
      pfiDid: (order as Order).metadata.to,
      did: customerDid as unknown as BearerDid,
      exchangeId: order.metadata.exchangeId,
    });

    let orderStatusUpdate: OrderStatus | null = null;
    let close: Close | null = null;

    for (const message of exchange) {
      if (message instanceof OrderStatus) {
        orderStatusUpdate = message;
      } else if (message instanceof Close) {
        close = message;
        break;
      }
    }

    res.json({ orderStatusUpdate, close });
  } catch (error: unknown) {
    res.status(500).json({ error: `Error polling order status: ${(error as Error).message}` });
  }
});

app.get('/getExchanges', async (req: Request, res: Response) => {
  try {
    const { pfiDid, userDid } = req.query;
    if (typeof pfiDid !== 'string' || typeof userDid !== 'string') {
      throw new Error('Invalid parameters provided');
    }
    const exchanges = await TbdexHttpClient.getExchanges({
      pfiDid,
      did: userDid as unknown as BearerDid,
    });
    res.json(exchanges);
  } catch (error: unknown) {
    res.status(500).json({ error: `Error fetching exchanges: ${(error as Error).message}` });
  }
});

ViteExpress.listen(app, port, () =>
  console.log("Server is listening on port 3000..."),
);