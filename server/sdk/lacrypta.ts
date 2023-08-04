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
  LnUrlRequestArgs,
  MethodTypes,
  SDKConfig,
  WalletDetailsResponse,
} from "./types";

export class SDKCrypta {
  baseUrl = "https://wallet.lacrypta.ar";
  ADMIN_KEY = "";
  INVOICE_READ_KEY = "";

  constructor(config: SDKConfig) {
    if (!config.ADMIN_KEY || !config.INVOICE_READ_KEY) {
      throw new Error("Need ADMIN_KEY and INVOICE_READ_KEY");
    }

    this.ADMIN_KEY = config.ADMIN_KEY;
    this.INVOICE_READ_KEY = config.INVOICE_READ_KEY;
  }

  call(
    endpoint: string,
    method: MethodTypes,
    key: string,
    params: Record<string, any> = {},
    extension: string = ""
  ) {
    const formattedUrl = `${this.baseUrl}/${
      extension ? `${extension}/api/v1` : "api/v1"
    }`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": key,
      },
    };

    if (method !== "GET" && params) options.body = JSON.stringify(params);

    return fetch(`${formattedUrl}/${endpoint}`, options)
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

  createPayLink(linkConfig: LnUrlRequestArgs) {
    return this.call("links", "POST", this.ADMIN_KEY, linkConfig, "lnurlp");
  }

  listPayLinks() {
    return this.call("links", "GET", this.INVOICE_READ_KEY, {}, "lnurlp");
  }

  getPayLink(payId: string) {
    return this.call(
      `links/${payId}`,
      "GET",
      this.INVOICE_READ_KEY,
      {},
      "lnurlp"
    );
  }

  updatePayLink(
    payId: string,
    updateConfig: { description: string; amount: number }
  ) {
    return this.call(
      `links/${payId}`,
      "PUT",
      this.ADMIN_KEY,
      {
        ...updateConfig,
        min: updateConfig.amount,
        max: updateConfig.amount,
      },
      "lnurlp"
    );
  }

  deletePayLink(payId: string) {
    return this.call(`links/${payId}`, "DELETE", this.ADMIN_KEY, {}, "lnurlp");
  }
}
