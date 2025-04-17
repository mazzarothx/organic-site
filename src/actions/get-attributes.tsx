import { ProductAttribute } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/attributes`;

async function getAttributes(): Promise<ProductAttribute[]> {
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching attributes:", error);
    throw error;
  }
}

export default getAttributes;
