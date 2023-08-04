export interface Invoice {
  out: boolean;
  amount: number;
  min?: number;
  max?: number;
  memo?: string;
  expiry?: number;
  unit?: string;
  webhook?: string;
  internal?: boolean;
}

export interface SDKConfig {
  ADMIN_KEY: string;
  INVOICE_READ_KEY: string;
}

export type MethodTypes = "GET" | "POST" | "PUT" | "DELETE";

export type WalletDetailsResponse = {
  name: string;
  balance: number;
};

export type CreateInvoiceResponse = {
  payment_hash: string;
  payment_request: string;
  checking_id: string;
  lnurl_response: string;
};

export type InvoiceStatusResponse = {
  paid: boolean;
  preimage: string;
  details: {
    checking_id: string;
    pending: boolean;
    amount: number;
    fee: number;
    memo: string;
    time: number;
    bolt11: string;
    preimage: string;
    payment_hash: string;
    expiry: number;
    extra: Record<any, any>;
    wallet_id: string;
    webhook: string;
    webhook_status: number | null;
  };
};

export type DecodeInvoiceResponse = {
  payment_hash: string;
  amount_msat: number;
  description: string;
  description_hash: string | null;
  payee: string;
  date: number;
  expiry: number;
  secret: string;
  route_hints: Array<any>;
  min_final_cltv_expiry: number;
};

export type LnUrlRequestArgs = {
  amount: number;
  description: string;
  min?: number;
  max?: number;
  webhook_url: string;
  comment_chars?: number;
  username?: string;
};
