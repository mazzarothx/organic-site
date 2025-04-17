import { Product } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/products`;

async function getProduct(slug: string): Promise<Product> {
  try {
    const response = await axios.get(`${URL}/${slug}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      throw new Error("Product not found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export default getProduct;
