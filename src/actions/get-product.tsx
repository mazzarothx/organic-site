// @/actions/get-product.tsx
import { ProductResponse, ProductVariant, ProductWithDetails } from "@/types";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in environment variables",
  );
}

export async function getProduct(
  slug: string,
): Promise<ProductWithDetails | null> {
  try {
    const response = await axios.get(`${BASE_URL}/shop/products/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
      timeout: 5000, // 5 segundos timeout
    });

    // Verificar se os dados recebidos são válidos
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid product data received");
    }

    const productData = response.data as ProductResponse;

    // Função para parsear as variações
    const parseVariations = (
      variations: ProductVariant[] | string,
    ): ProductVariant[] => {
      if (typeof variations === "string") {
        try {
          const parsed = JSON.parse(variations);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          console.error("Error parsing variations:", error);
          return [];
        }
      }
      return variations || [];
    };

    return {
      ...productData,
      attributes: productData.attributes || null,
      variations: parseVariations(productData.variations),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Tratar erros específicos da API
      if (error.response?.status === 401) {
        console.error("Authentication failed - Check your API_TOKEN");
        throw new Error(
          "Authentication failed. Please check your credentials.",
        );
      }

      if (error.response?.status === 404) {
        return null; // Produto não encontrado
      }

      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch product (Status: ${error.response?.status})`;
      console.error("[GET_PRODUCT_ERROR]", errorMessage);
      throw new Error(errorMessage);
    }

    console.error("[GET_PRODUCT_ERROR]", error);
    throw new Error("Failed to load product. Please try again later.");
  }
}
