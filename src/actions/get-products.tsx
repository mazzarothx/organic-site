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
    console.error("Error fetching products:", error);
    throw error;
  }
}

export default getProducts;
