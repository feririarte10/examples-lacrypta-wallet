import fetch from "cross-fetch";
import lnurl from "lnurl-pay";
import { Satoshis } from "lnurl-pay/dist/types/types";

interface SDKConfig {
  ADMIN_KEY: string;
  INVOICE_READ_KEY: string;
}

type MethodTypes = "GET" | "POST" | "PUT";

export class SDKCrypta {
  baseUrl = "https://wallet.lacrypta.ar/api/v1/";
  ADMIN_KEY = "";
  INVOICE_READ_KEY = "";

  constructor(config: SDKConfig) {
    if (!config.ADMIN_KEY || !config.INVOICE_READ_KEY) {
      throw new Error("Need ADMIN_KEY and INVOICE_READ_KEY");
    }

    this.ADMIN_KEY = config.ADMIN_KEY;
    this.INVOICE_READ_KEY = config.INVOICE_READ_KEY;
  }

  call(endpoint: string, method: MethodTypes, key: string, params = {}) {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": key,
      },
    };

    if (method !== "GET") options.body = JSON.stringify(params);

    return fetch(`${this.baseUrl}/${endpoint}`, options)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  async createInvoice(lnUrlOrAddress: string, msats: number) {
    const satoshisToSend = msats / 1000;

    const invoice = await lnurl.requestInvoice({
      lnUrlOrAddress,
      tokens: satoshisToSend as Satoshis,
    });

    return invoice;
  }

  payInvoice(invoice: string) {
    return this.call("payments", "POST", this.ADMIN_KEY, {
      out: true,
      bolt11: invoice,
    });
  }

  getPaymentStatus(paymentHash: string) {
    return this.call(`payments/${paymentHash}`, "GET", this.INVOICE_READ_KEY);
  }
}
