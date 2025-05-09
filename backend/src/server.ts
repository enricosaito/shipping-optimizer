import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getNfeById, getNfeByAccessKey, getProductImage } from "./services/blingService";
import axios from "axios";
import { Request, Response } from "express";
import { packOrder } from "./services/packingService";

dotenv.config();

// Debug logging for environment variables
console.log("Environment variables loaded:");
console.log("BLING_CLIENT_ID:", process.env.BLING_CLIENT_ID ? "Set" : "Not set");
console.log("BLING_REDIRECT_URI:", process.env.BLING_REDIRECT_URI ? "Set" : "Not set");
console.log("BLING_ACCESS_TOKEN:", process.env.BLING_ACCESS_TOKEN ? "Set" : "Not set");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// In-memory storage for the access token (for development only)
let blingAccessToken: string | null = process.env.BLING_ACCESS_TOKEN || null;

// Route to get NFE by access key
app.get("/api/nfe", async (req: Request, res: Response): Promise<void> => {
  console.log("Received request to /api/nfe");
  console.log("Query parameters:", req.query);
  console.log("Headers:", req.headers);
  try {
    if (!blingAccessToken) {
      console.log("No Bling access token found");
      res.status(401).json({ error: "Bling access token not set. Please authenticate first." });
      return;
    }
    const { chaveAcesso } = req.query;
    if (!chaveAcesso) {
      console.log("No chaveAcesso provided");
      res.status(400).json({ error: "Access key is required" });
      return;
    }
    console.log("Making request to Bling API with chaveAcesso:", chaveAcesso);
    const nfeData = await getNfeByAccessKey(chaveAcesso as string, blingAccessToken);
    console.log("Received response from Bling API");
    res.json(nfeData);
  } catch (error) {
    console.error("Error fetching NFE:", error);
    res.status(500).json({ error: "Failed to fetch NFE data" });
  }
});

// Route to get NFE details by ID
app.get("/api/nfe/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!blingAccessToken) {
      res.status(401).json({ error: "Bling access token not set. Please authenticate first." });
      return;
    }
    const { id } = req.params;
    const nfeDetails = await getNfeById(id, blingAccessToken);
    res.json(nfeDetails);
  } catch (error) {
    console.error("Error fetching NFE details:", error);
    res.status(500).json({ error: "Failed to fetch NFE details" });
  }
});

// Route to get product image
app.get("/api/produtos/:codigo", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!blingAccessToken) {
      res.status(401).json({ error: "Bling access token not set. Please authenticate first." });
      return;
    }
    const { codigo } = req.params;
    const imageUrl = await getProductImage(codigo, blingAccessToken);
    res.json({ imagemURL: imageUrl });
  } catch (error) {
    console.error("Error fetching product image:", error);
    res.status(500).json({ error: "Failed to fetch product image" });
  }
});

// Packing API endpoint
app.post("/api/pack-order", (req: Request, res: Response) => {
  try {
    const order = req.body.order;
    if (!Array.isArray(order)) {
      res.status(400).json({ error: "Order must be an array of { name, quantity }" });
      return;
    }
    const result = packOrder(order);
    res.json(result);
  } catch (error) {
    console.error("Error in /api/pack-order:", error);
    res.status(500).json({ error: "Failed to pack order" });
  }
});

app.get("/auth/bling", (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.BLING_CLIENT_ID!,
    redirect_uri: process.env.BLING_REDIRECT_URI!,
    // scope: "your_scope", // Uncomment if needed
    // state: "optional_state", // Uncomment if needed
  });
  res.redirect(`https://bling.com.br/Api/v3/oauth/authorize?${params.toString()}`);
});

app.get("/auth/bling/callback", async (req: Request, res: Response): Promise<void> => {
  const { code } = req.query;
  if (!code) {
    res.status(400).send("No code provided");
    return;
  }
  try {
    const tokenRes = await axios.post(
      "https://bling.com.br/Api/v3/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.BLING_REDIRECT_URI!,
        client_id: process.env.BLING_CLIENT_ID!,
        client_secret: process.env.BLING_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    blingAccessToken = tokenRes.data.access_token;
    res.json(tokenRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Token exchange failed");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
