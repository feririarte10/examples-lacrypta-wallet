import { SDKCrypta } from "./dist/sdk/lacrypta.js";

const crypta = new SDKCrypta({
  ADMIN_KEY: "",
  INVOICE_READ_KEY: "",
});

const createInvoice = async () => {
  crypta
    .createInvoice({
      out: false,
      amount: 1,
      webhook: "https://14ff-191-85-43-164.ngrok-free.app/webhook",
    })
    .then((invoice) => {
      console.log(invoice);
    });
};

const getPaymentStatus = () => {
  crypta
    .getInvoiceStatus(
      "f9c8a14ee5f1553fbc403ce866305bb3a78bf24ae78a5c0081632aff65e102b3"
    )
    .then((status) => {
      console.log(status);
    });
};

const decodeInvoice = () => {
  const bolt11 =
    "lnbc10n1pjv6wyjpp5l8y2znh9792nl0zq8n5xvvzmkwnchuj2u799cqypvv407e0pq2esdq6f3sjqsmj09c8gcfq2askcmr9wscqzzsxqzjcsp5qstwwm505pung0685hxuv3nn6l4f8nx68tqhrn8u5aczz54a35vq9qyyssqpnz4uef6cdvrw6t0qrryyd872vlzl4vz5le6hvlkxtasyd6hwwu3npdz9yfvmeglvvzker59z0k8aw73wfna4z4f7fusmsma5velhhsqj5j452";

  crypta.decodeInvoice(bolt11).then((decodedInvoice) => {
    console.log(decodedInvoice);
  });
};

const getWalletDetails = () => {
  crypta.walletDetails().then((details) => {
    console.log(details);
  });
};

const createOutInvoice = () => {
  crypta.createOutgoingInvoice("fer@hodl.ar", 10).then((invoice) => {
    console.log(invoice);
  });
};

const createLink = () => {
  crypta
    .createPayLink({
      description: "Holaprobando",
      amount: 10,
    })
    .then((result) => {
      console.log(result);
    });
};

const getPayLink = () => {
  crypta.getPayLink("NSrjDd").then((result) => {
    console.log(result);
  });
};

const updatePayLink = () => {
  crypta
    .updatePayLink("NSrjDd", {
      amount: 10,
      description: "Holaproban222",
    })
    .then((result) => {
      console.log(result);
    });
};

// updatePayLink();
// getPayLink();
// getPaymentStatus();
// createInvoice();
// createOutInvoice();
// getWalletDetails();
// decodeInvoice();
// createLNUrl();
