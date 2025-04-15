import { CartProduct } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
  items: CartProduct[];
  addItem: (data: CartProduct) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, data: CartProduct) => void;
  validateCart: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => {
      const updateItem = (id: string, data: CartProduct) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? data : item)),
        }));
      };

      return {
        items: [],
        addItem: (data: CartProduct) => {
          const currentItems = get().items;
          const existingItem = currentItems.find((item) => item.id === data.id);

          if (existingItem) {
            // Se o item já existe, atualiza a quantidade
            const updatedItem = {
              ...existingItem,
              quantity: existingItem.quantity + data.quantity, // Soma a quantidade
            };

            // Atualiza o item no carrinho
            set({
              items: currentItems.map((item) =>
                item.id === data.id ? updatedItem : item,
              ),
            });

            toast.success("Item quantity updated in cart.");
          } else {
            // Se o item não existe, adiciona ao carrinho
            set({ items: [...currentItems, data] });
            toast.success("Item added to cart.");
          }
        },
        removeItem: (id: string) => {
          set({ items: [...get().items.filter((item) => item.id !== id)] });
        },
        removeAll: () => set({ items: [] }),
        updateQuantity: (id: string, quantity: number) => {
          set({
            items: get().items.map((item) => {
              if (item.id === id) {
                return { ...item, quantity };
              }
              return item;
            }),
          });
        },
        updateItem: (id: string, data: CartProduct) => {
          updateItem(id, data);
        },
        validateCart: async () => {
          const { items } = get();
          const response = await axios.patch("/api/validate-cart", items);

          if (response.status === 204) {
            return;
          }

          if (response.data) {
            const updatedItems: CartProduct[] = response.data;
            updatedItems.forEach((item) => {
              updateItem(item.id, item);
            });
          } else {
            console.error("Erro ao validar o carrinho:", response.data);
          }
        },
      };
    },
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
