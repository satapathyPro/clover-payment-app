// server.js  (ESM)
// --------------------------------------------------
// 1) Load .env FIRST, before anything else touches process.env
// 2) Then import the rest of your application
// --------------------------------------------------

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the project root so .env is found no matter where you run node
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });   // <-- now process.env is populated

//----------------------------------------------------
// Normal app bootstrap
//----------------------------------------------------
import express from "express";
import cors from "cors";

import authRoutes    from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

const app = express();

app.use(cors());
app.use(express.json());

// Mount route modules
app.use("/api/auth",     authRoutes);
app.use("/api/payment",  paymentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Clover backend running on port ${PORT}`);
});
