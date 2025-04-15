// @/actions/get-products.ts
import { Product } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/products`;

async function getProducts(): Promise<Product[]> {
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching products:", error.response?.data);
      throw {
        message: error.response?.data?.message || "Failed to fetch products",
        status: error.response?.status,
        data: error.response?.data,
      };
    }
    console.error("Unexpected error fetching products:", error);
    throw { message: "An unexpected error occurred" };
  }
}

export default getProducts;
