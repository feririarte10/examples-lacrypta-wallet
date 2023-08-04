import fetch from "cross-fetch";
import lnurl from "lnurl-pay";
import {
  LnUrlRequestInvoiceResponse,
  Satoshis,
} from "lnurl-pay/dist/types/types";
import {
  CreateInvoiceResponse,
  DecodeInvoiceResponse,
  Invoice,
  InvoiceStatusResponse,
  MethodTypes,
  SDKConfig,
  WalletDetailsResponse,
} from "./types";

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

  walletDetails(): Promise<WalletDetailsResponse> {
    return this.call("wallet", "GET", this.INVOICE_READ_KEY);
  }

  createInvoice(invoiceConfig: Invoice): Promise<CreateInvoiceResponse> {
    return this.call("payments", "POST", this.INVOICE_READ_KEY, invoiceConfig);
  }

  payInvoice(invoice: string) {
    return this.call("payments", "POST", this.ADMIN_KEY, {
      out: true,
      bolt11: invoice,
    });
  }

  getInvoiceStatus(paymentHash: string): Promise<InvoiceStatusResponse> {
    return this.call(`payments/${paymentHash}`, "GET", this.INVOICE_READ_KEY);
  }

  decodeInvoice(lnUrlOrBolt11: string): Promise<DecodeInvoiceResponse> {
    return this.call("payments/decode", "POST", this.INVOICE_READ_KEY, {
      data: lnUrlOrBolt11,
    });
  }

  createOutgoingInvoice(
    lnUrlOrAddress: string,
    sats: number
  ): Promise<LnUrlRequestInvoiceResponse> {
    return lnurl
      .requestInvoice({
        lnUrlOrAddress,
        tokens: sats as Satoshis,
      })
      .then((invoice) => {
        return invoice;
      });
  }
}
