import express from "express";
import axios from "axios";
import qs from "qs";
import { load, save } from "../tokenStore.js";

const router = express.Router();

const CLOVER_API = "https://api-sandbox.dev.clover.com/v3/merchants";
const CLOVER_OAUTH = "https://sandbox.dev.clover.com/oauth/token";
const { CLOVER_CLIENT_ID, CLOVER_CLIENT_SECRET } = process.env;

// Helper: ensure access token is fresh (auto refresh if needed)
async function getAccessToken() {
  let tokens = load();
  if (!tokens) throw new Error("Clover not connected");

  const expiresAt = tokens.obtained + tokens.expires_in * 1000 - 60 * 1000; // refresh 1 min early
  if (Date.now() < expiresAt) return tokens; // still valid

  // refresh
  const { data } = await axios.post(
    CLOVER_OAUTH,
    qs.stringify({
      client_id: CLOVER_CLIENT_ID,
      client_secret: CLOVER_CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  tokens = { ...tokens, ...data, obtained: Date.now() };
  save(tokens);
  return tokens;
}

router.post("/", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const tokens = await getAccessToken();
    const headers = { Authorization: `Bearer ${tokens.access_token}` };
    const mId = tokens.merchant_id;

    // 1. Create order
    const order = await axios.post(
      `${CLOVER_API}/${mId}/orders`,
      { total: amount },
      { headers }
    );

    const orderId = order.data.id;

    // 2. Add single line item
    await axios.post(
      `${CLOVER_API}/${mId}/orders/${orderId}/line_items`,
      [
        {
          name: description || "Line Item",
          price: amount,
          quantity: 1,
        },
      ],
      { headers }
    );

    // 3. Pay the order using test token method
    const payment = await axios.post(
      `${CLOVER_API}/${mId}/payments`,
      {
        amount,
        orderId,
        source: "CLOVER_TEST_TOKEN", // test flow – see docs
      },
      { headers }
    );

    res.json(payment.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

export default router;