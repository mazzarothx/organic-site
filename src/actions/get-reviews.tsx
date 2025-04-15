import { Review } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/reviews`;

const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await axios.get(`${URL}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      throw new Error("Reviews not found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default getReviews;
