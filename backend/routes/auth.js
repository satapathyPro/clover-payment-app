import express from "express";
import axios from "axios";
import qs from "qs";
import { save, load, clear } from "../tokenStore.js";

const router = express.Router();
const { CLOVER_CLIENT_ID, CLOVER_CLIENT_SECRET, CLOVER_REDIRECT_URI } =
  process.env;
const CLOVER_AUTH = "https://sandbox.dev.clover.com/oauth";

// 1. Get login URL for the frontend
router.get("/login", (_req, res) => {
  const params = qs.stringify({
    client_id: CLOVER_CLIENT_ID,
    response_type: "code",
    scope: "payments.read payments.write",
    redirect_uri: CLOVER_REDIRECT_URI,
  });
  res.json({ url: `${CLOVER_AUTH}/authorize?${params}` });
});

// 2. OAuth2 callback
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing authorization code");

  try {
    const { data } = await axios.post(
      `${CLOVER_AUTH}/token`,
      qs.stringify({
        client_id: CLOVER_CLIENT_ID,
        client_secret: CLOVER_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: CLOVER_REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Persist tokens with timestamp
    save({ ...data, obtained: Date.now() });

    // Redirect back to frontend
    res.redirect("http://localhost:3000");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send(err.response?.data || err.message);
  }
});

// 3. Simple status endpoint (used by frontend)
router.get("/status", (_req, res) => {
  const tokens = load();
  res.json({ connected: !!tokens });
});

// 4. Logout helper (optional)
router.post("/logout", (_req, res) => {
  clear();
  res.sendStatus(204);
});

export default router;