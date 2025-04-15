import { User } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

const getUser = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`${URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      throw new Error("User not found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default getUser;
