// @/actions/get-sub-attributes.tsx
import { apiConfig, getApiBaseUrl, handleApiError } from "@/lib/api-helpers";
import { ProductSubAttribute } from "@/types";
import axios from "axios";

const getSubAttributes = async (): Promise<ProductSubAttribute[]> => {
  // Rota corrigida para /shop/attributes/sub-attributes
  const API_URL = `${getApiBaseUrl()}/shop/attributes/sub-attributes`;

  try {
    const response = await axios.get<ProductSubAttribute[]>(API_URL, {
      ...apiConfig,
      params: {
        active: true,
        cache: new Date().getTime(),
      },
    });

    // Verificação de dados (mantida como antes)
    if (!Array.isArray(response.data)) {
      console.error("Invalid sub-attributes data format:", response.data);
      throw {
        message: "Invalid data format received",
        status: 500,
        data: response.data,
      };
    }

    const validSubAttributes = response.data.filter(
      (subAttr) =>
        subAttr?.id &&
        subAttr?.name &&
        subAttr?.slug &&
        subAttr?.productAttributeId,
    );

    return validSubAttributes;
  } catch (error) {
    const handledError = handleApiError(error, "sub-attributes");
    return handledError || []; // Fallback para array vazio
  }
};

export default getSubAttributes;
