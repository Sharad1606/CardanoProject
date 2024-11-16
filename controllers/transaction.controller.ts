import { Request, Response } from "express";
import { supabase } from "../models/transaction.model";
import {
  verifyWebhookSignature,
  SignatureVerificationError,
  WebhookEventTransaction,
} from "@blockfrost/blockfrost-js";


// Create a new transaction
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  const { amount, recipient_address, status, tx_id } = req.body;

  if (!amount || !recipient_address || !status || !tx_id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert([{ amount, recipient_address, status, tx_id }]);

  if (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({ transaction: data ? data[0] : null });
};

// Get a transaction by tx_id
export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  const { tx_id } = req.params;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("tx_id", tx_id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: error.message });
    return;
  }

  if (!data) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  res.status(200).json({ transaction: data });
};



// get all data from transaction table
export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  // Fetch all transactions from the 'transactions' table
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .limit(10);

  // Log the response data and error for debugging
  console.log('Data:', data);
  console.log('Error:', error);

  // Error handling
  if (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: error.message });
    return;
  }

  // Check if no data was found
  if (!data || data.length === 0) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  // Successfully return the data
  console.log("Fetched transactions:", data);
  res.status(200).json({ transactions: data });
};




// ===========================
// Blockfrost webhook controller


export const webHookController = async (req: Request, res: Response) => {
  try {
    const signatureHeader = req.headers['blockfrost-signature'];

    if (!signatureHeader) {
      res.status(404).json("Missing Blockfrost Signature Header");
      return;
    }

    // Check that the secret token is not undefined
    if (!process.env.WEBHOOK_SECRET_AUTH_TOKEN) {
      throw new Error('WEBHOOK_SECRET_AUTH_TOKEN is not set');
    }

    console.log("Webhook Secret Token:", process.env.WEBHOOK_SECRET_AUTH_TOKEN); // Log token for verification
    
    // Verify the signature
    verifyWebhookSignature(
      JSON.stringify(req.body),
      signatureHeader,
      process.env.WEBHOOK_SECRET_AUTH_TOKEN as string
    );

    const { type, payload } = req.body;

    if (type !== 'transaction') {
      res.status(404).json(`Unexpected event type ${type}`);
      return;
    }

    console.log(`Received ${payload.length} transactions`);
    for (const transaction of payload) {
      console.log(`Transaction hash: ${transaction.tx.hash}`);
      console.log("Transaction Details:", JSON.stringify(transaction, null, 2));
      console.log("---------New transaction--------");
    }

    res.status(200).json({ success: true, processed: true });
  } catch (error:any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



