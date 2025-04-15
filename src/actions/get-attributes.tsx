// @/actions/get-attributes.tsx
import { apiConfig, getApiBaseUrl, handleApiError } from "@/lib/api-helpers";
import { ProductAttribute } from "@/types";
import axios from "axios";

const getAttributes = async (): Promise<ProductAttribute[]> => {
  // Rota mantida como /shop/attributes
  const API_URL = `${getApiBaseUrl()}/shop/attributes`;

  try {
    const response = await axios.get<ProductAttribute[]>(API_URL, apiConfig);

    if (!Array.isArray(response.data)) {
      throw {
        message: "Invalid attributes data format",
        status: 500,
        data: response.data,
      };
    }

    return response.data;
  } catch (error) {
    return handleApiError(error, "attributes") || [];
  }
};

export default getAttributes;
