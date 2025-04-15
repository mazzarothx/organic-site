// @/actions/get-product.tsx
import { apiConfig, getApiBaseUrl, handleApiError } from "@/lib/api-helpers";
import { Product } from "@/types";
import axios from "axios";

const getProduct = async (slug: string): Promise<Product | null> => {
  const API_URL = `${getApiBaseUrl()}/shop/products/${slug}`;

  try {
    const response = await axios.get(API_URL, apiConfig);

    if (!response.data) {
      console.warn("Empty product data received");
      return null;
    }

    return response.data;
  } catch (error) {
    return handleApiError(error, "product") as Product | null;
  }
};

export default getProduct;
