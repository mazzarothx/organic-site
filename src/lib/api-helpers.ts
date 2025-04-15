// @/lib/api-helpers.ts
import axios from "axios";

export const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    throw new Error("API URL is not configured");
  }

  // Adiciona protocolo se necessário
  if (!baseUrl.startsWith("http")) {
    return process.env.NODE_ENV === "development"
      ? `http://${baseUrl}`
      : `https://${baseUrl}`;
  }
  return baseUrl;
};

export const apiConfig = {
  timeout: 15000, // 15 segundos
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
  validateStatus: (status: number) => status < 500, // Não rejeitar para erros 4xx
};

export const handleApiError = (error: unknown, endpoint: string) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      `Failed to fetch ${endpoint}`;

    console.error(`API Error (${endpoint}):`, {
      status,
      message,
      code: error.code,
      url: error.config?.url,
    });

    // Para erros 404, retornar null para permitir fallback
    if (status === 404) {
      return null;
    }

    throw {
      message,
      status,
      isApiError: true,
    };
  }

  console.error(`Unknown API Error (${endpoint}):`, error);
  throw {
    message: `Unknown error occurred while fetching ${endpoint}`,
    status: 500,
    isApiError: true,
  };
};
