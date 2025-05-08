import axios from "axios";
import fs from "fs";
import path from "path";
import { getProductImagePath } from "../data/productImageMapping";

const BLING_API_BASE_URL = "https://api.bling.com.br/Api/v3";
const PRODUCT_IMAGES_FILE = path.join(__dirname, "../data/productImages.json");

// Helper function to read product images from file
const readProductImages = (): Record<string, string> => {
  try {
    const data = fs.readFileSync(PRODUCT_IMAGES_FILE, "utf8");
    return JSON.parse(data).productImages;
  } catch (error) {
    console.error("Error reading product images file:", error);
    return {};
  }
};

// Helper function to write product images to file
const writeProductImages = (images: Record<string, string>) => {
  try {
    fs.writeFileSync(PRODUCT_IMAGES_FILE, JSON.stringify({ productImages: images }, null, 2));
  } catch (error) {
    console.error("Error writing product images file:", error);
  }
};

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

export const getNfeByAccessKey = async (chaveAcesso: string, accessToken: string): Promise<NfeResponse> => {
  try {
    console.log("Making request to Bling API:");
    console.log("URL:", `${BLING_API_BASE_URL}/nfe?chaveAcesso=${chaveAcesso}`);
    console.log("Headers:", {
      Authorization: `Bearer ${accessToken.substring(0, 10)}...`,
      "Content-Type": "application/json",
    });

    const response = await axios.get(`${BLING_API_BASE_URL}/nfe?chaveAcesso=${chaveAcesso}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Bling API response status:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Error in getNfeByAccessKey:");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const getNfeById = async (id: string, accessToken: string): Promise<NfeDetails> => {
  try {
    const response = await axios.get(`${BLING_API_BASE_URL}/nfe/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getNfeById:", error);
    throw error;
  }
};

export const getProductImage = async (codigo: string, accessToken: string): Promise<string | null> => {
  // For now, we'll just return null as we'll handle the image mapping in the frontend
  return null;
};
