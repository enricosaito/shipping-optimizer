import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getNfeById, getNfeByAccessKey } from "./services/blingService";
import axios from "axios";
import { Request, Response } from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage for the access token (for development only)
let blingAccessToken: string | null = null;

// Route to get NFE by access key
app.get("/api/nfe", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!blingAccessToken) {
      res.status(401).json({ error: "Bling access token not set. Please authenticate first." });
      return;
    }
    const { chaveAcesso } = req.query;
    if (!chaveAcesso) {
      res.status(400).json({ error: "Access key is required" });
      return;
    }
    const nfeData = await getNfeByAccessKey(chaveAcesso as string, blingAccessToken);
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
