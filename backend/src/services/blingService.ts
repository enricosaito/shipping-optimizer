import axios from "axios";

const BLING_API_BASE_URL = "https://api.bling.com.br/Api/v3";

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
    const response = await axios.get(`${BLING_API_BASE_URL}/nfe?chaveAcesso=${chaveAcesso}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getNfeByAccessKey:", error);
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
