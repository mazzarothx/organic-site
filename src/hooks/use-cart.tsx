import { CartProduct } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  items: CartProduct[];
  addItem: (data: CartProduct) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  validateCart: () => boolean;
  updateItem: (id: string, data: Partial<CartProduct>) => void; // Adicione esta linha
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (data: CartProduct) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.variationId === data.variationId,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.variationId === data.variationId
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + data.quantity,
                        item.availableQuantity,
                      ),
                    }
                  : item,
              ),
            };
          }

          return { items: [...state.items, data] };
        });
      },
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.variationId !== id),
        }));
      },
      removeAll: () => set({ items: [] }),
      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.variationId === id) {
              // Garante que a quantidade está dentro dos limites permitidos
              const newQuantity = Math.max(
                item.minQuantity,
                Math.min(quantity, item.availableQuantity),
              );
              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
        }));
      },

      updateItem: (id: string, data: Partial<CartProduct>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...data } : item,
          ),
        }));
      },
      validateCart: () => {
        const { items } = get();
        let isValid = true;

        // Verifica cada item do carrinho
        const validatedItems = items.filter((item) => {
          const itemIsValid =
            item.quantity >= item.minQuantity &&
            item.quantity <= item.availableQuantity;

          if (!itemIsValid) {
            isValid = false;
            toast.warning(
              `O item ${item.name} foi removido por quantidade inválida`,
            );
          }

          return itemIsValid;
        });

        // Se algum item foi removido, atualiza o carrinho
        if (validatedItems.length !== items.length) {
          set({ items: validatedItems });
        }

        return isValid;
      },
    }),
    {
      name: "cart-storage",
      version: 1, // Adicione uma versão para futuras migrações
    },
  ),
);
