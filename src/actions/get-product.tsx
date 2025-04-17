import { Product } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/products`;

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await axios.get(`${URL}/${slug}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

export default getProduct;
