import { Router } from "express";
import { createTransaction, getAllTransactions, getTransactionById } from "../controllers/transaction.controller";

const router = Router();

// Define routes
router.put("/transaction/new", createTransaction);
router.get("/transaction/:tx_id", getTransactionById);
router.get("/transaction/getAllTransaction", getAllTransactions);

export default router;
