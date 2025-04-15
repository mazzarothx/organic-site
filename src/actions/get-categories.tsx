// @/actions/get-categories.ts
import { ProductCategory } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/categories`;

async function getCategories(): Promise<ProductCategory[]> {
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      throw new Error("Categories not found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export default getCategories;
