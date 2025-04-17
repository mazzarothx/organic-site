import { ProductSubcategory } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/categories/subcategories`;

async function getSubCategories(): Promise<ProductSubcategory[]> {
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    throw error;
  }
}

export default getSubCategories;
