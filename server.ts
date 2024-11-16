//acts as app.ts
import express from "express";
import bodyParser from "body-parser";
import router from "./routes";

import dotenv from 'dotenv';
dotenv.config();

// To check if the variables are properly loaded

// console.log("WEBHOOK_SECRET_AUTH_TOKEN:", process.env.WEBHOOK_SECRET_AUTH_TOKEN);
// console.log("BLOCKFROST_API_KEY:", process.env.BLOCKFROST_API_KEY);

const app = express();
const port = 3000;


// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());


app.use("/", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
