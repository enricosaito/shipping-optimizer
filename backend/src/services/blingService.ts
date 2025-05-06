import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BLING_API_KEY = process.env.BLING_API_KEY;
const BLING_API_BASE_URL = "https://api.bling.com.br/Api/v3";

if (!BLING_API_KEY) {
  throw new Error("BLING_API_KEY is not defined in environment variables");
}

const blingApi = axios.create({
  baseURL: BLING_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${BLING_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export interface NfeResponse {
  id: number;
  // Add other fields as needed based on the API response
}

export interface NfeDetails {
  // Add fields based on the API response structure
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    // Add other product fields as needed
  }>;
}

export const getNfeByAccessKey = async (chaveAcesso: string): Promise<NfeResponse> => {
  try {
    const response = await blingApi.get(`/nfe?chaveAcesso=${chaveAcesso}`);
    return response.data;
  } catch (error) {
    console.error("Error in getNfeByAccessKey:", error);
    throw error;
  }
};

export const getNfeById = async (id: string): Promise<NfeDetails> => {
  try {
    const response = await blingApi.get(`/nfe/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getNfeById:", error);
    throw error;
  }
};
