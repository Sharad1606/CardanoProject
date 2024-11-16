import { Router } from "express";
import { createTransaction, getAllTransactions, getTransactionById, webHookController } from "../controllers/transaction.controller";

const router = Router();

// Define routes
router.put("/transaction/new", createTransaction);
router.get("/transaction/:tx_id", getTransactionById);
router.get("/transaction/getAllTransaction", getAllTransactions);

// Webhook route
router.post("/webhook", webHookController); // This is the route that Blockfrost should call

export default router;
