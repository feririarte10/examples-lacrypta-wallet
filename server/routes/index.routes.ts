import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import { SDKCrypta } from "../sdk/lacrypta";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const handlePayment = async (data: any) => {
  const crypta = new SDKCrypta({
    ADMIN_KEY: process.env.ADMIN_KEY as string,
    INVOICE_READ_KEY: process.env.INVOICE_READ_KEY as string,
  });

  if (data && data.payment_hash) {
    crypta.getInvoiceStatus(data.payment_hash).then((paymentInfo) => {
      if (paymentInfo && paymentInfo.paid)
        crypta
          .createOutgoingInvoice(
            "fer@hodl.ar",
            paymentInfo.details.amount / 1000
          )
          .then((invoiceInfo) => {
            if (invoiceInfo && invoiceInfo.invoice)
              crypta.payInvoice(invoiceInfo.invoice);
          });
    });
  }
};

router.get("/status", (req: Request, res: Response) => {
  return res.json({ status: "ok", message: "Server is working" });
});

router.post("/webhook", (req: Request, res: Response) => {
  const data = req.body;
  handlePayment(data);
});

export default router;
