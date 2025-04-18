// src/hooks/use-cart.ts
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
  updateItem: (id: string, data: Partial<CartProduct>) => void;
  getItem: (
    variationId: string,
    subAttributes: string,
  ) => CartProduct | undefined;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Adiciona item ao carrinho ou atualiza quantidade se já existir
      addItem: (data: CartProduct) => {
        if (!data.id) {
          console.error("Item sem ID:", data);
          toast.error("Erro ao adicionar item ao carrinho");
          return;
        }

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === data.id,
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];

            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: Math.min(
                existingItem.quantity + data.quantity,
                existingItem.availableQuantity,
              ),
            };

            toast.success("Quantidade atualizada no carrinho");
            return { items: updatedItems };
          }

          toast.success("Produto adicionado ao carrinho");
          return { items: [...state.items, data] };
        });
      },

      // Remove item pelo ID
      removeItem: (id: string) => {
        if (!id) {
          console.error("Tentativa de remover item sem ID");
          return;
        }

        set((state) => {
          // Debug: mostre todos os IDs antes da remoção
          console.log(
            "IDs no carrinho:",
            state.items.map((item) => item.id),
          );
          console.log("Tentando remover ID:", id);

          const itemToRemove = state.items.find((item) => item.id === id);

          if (!itemToRemove) {
            console.warn("Item não encontrado no carrinho, ID:", id);
            return state;
          }

          toast.success(`"${itemToRemove.name}" removido do carrinho`);
          return { items: state.items.filter((item) => item.id !== id) };
        });
      },

      // Limpa todo o carrinho
      removeAll: () => {
        set({ items: [] });
        toast.success("Carrinho esvaziado");
      },

      // Atualiza quantidade de um item específico
      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              // Garante que a quantidade está dentro dos limites
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

      // Atualiza outros campos do item
      updateItem: (id: string, data: Partial<CartProduct>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...data } : item,
          ),
        }));
      },

      // Busca item por variação e atributos
      getItem: (variationId: string, subAttributes: string) => {
        return get().items.find(
          (item) =>
            item.variationId === variationId &&
            item.subAttributes === subAttributes,
        );
      },

      // Valida todos os itens do carrinho
      validateCart: () => {
        const { items } = get();
        let isValid = true;

        const validatedItems = items.filter((item) => {
          const itemIsValid =
            item.quantity >= item.minQuantity &&
            item.quantity <= item.availableQuantity;

          if (!itemIsValid) {
            isValid = false;
            toast.warning(
              `Item "${item.name}" foi removido: quantidade inválida`,
              {
                description: `Quantidade disponível: ${item.availableQuantity}`,
              },
            );
          }

          return itemIsValid;
        });

        if (validatedItems.length !== items.length) {
          set({ items: validatedItems });
        }

        return isValid;
      },
    }),
    {
      name: "cart-storage",
      version: 1,
      migrate: (persistedState: any, version) => {
        // Migração para versões futuras
        if (version === 0) {
          // Lógica de migração se necessário
        }
        return persistedState;
      },
    },
  ),
);

// Função auxiliar para gerar ID único
export const generateCartItemId = (
  productId: string,
  variationId: string,
  attributes: any[],
) => {
  const attributesHash = attributes
    .flatMap((attr) =>
      attr.subAttributes.map(
        (sub: { subAttributeId: any }) => sub.subAttributeId,
      ),
    )
    .sort()
    .join("-");

  return `${productId}-${variationId}-${attributesHash}`;
};
