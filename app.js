// =========================================================================================


const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = 3000;

// Initialize Supabase client, Supabase URL and Supabase anon key
const supabase = createClient(
  "https://rqulnpjsrkpzrnladoxp.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdWxucGpzcmtwenJubGFkb3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNDgyNzQsImV4cCI6MjA0NjkyNDI3NH0.4l-HCDY0Vw0v20kHh55cAB9W4i_HBhD12GmjMHxYZ8E" 
);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to create a new transaction
app.put("/transaction/new", async (req, res) => {
  try {
    const { amount, recipient_address, status, tx_id } = req.body;
    
    // Validate the input data
    if (!amount || !recipient_address || !status || !tx_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert new transaction into the database
    const { data, error } = await supabase
      .from("transactions")
      .insert([{ amount, recipient_address, status, tx_id }]);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ transaction: data[0] });
  } catch (err) {
    console.error("Request error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// Endpoint to get a transaction by tx_id
app.get("/transaction/:tx_id", async (req, res) => {
  const { tx_id } = req.params;

  // Retrieve transaction record from the database
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("tx_id", tx_id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.status(200).json({ transaction: data }); // logs data in console
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
