import { ProductImages, ProductWithDetails } from "@/types";
import { create } from "zustand";

interface CartItem extends Omit<ProductWithDetails, "quantity"> {
  selectedVariant: {
    id: string;
    price: number;
    imageRef?: {
      assetId: string;
      secureUrl: string;
    };
  } | null;
  quantity: number;
  images: ProductImages; // Garanta que está incluído
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
}

const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const itemId = item.selectedVariant
        ? `${item.id}-${item.selectedVariant.id}`
        : item.id;

      const existingItem = state.items.find((i) => i.id === itemId);

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity: 1,
            id: itemId,
          },
        ],
      };
    });
  },
}));

export default useCart;
