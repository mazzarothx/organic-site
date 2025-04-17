"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { ProductVariation, ProductWithDetails } from "@/types";

export const AddToCartButton = ({
  product,
  selectedVariant,
}: {
  product: ProductWithDetails;
  selectedVariant?: ProductVariation | null;
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      ...product,
      price: selectedVariant?.price || product.price,
      selectedVariant: selectedVariant || null,
      images: {
        cover: {
          assetId:
            selectedVariant?.imageRef?.assetId || product.images.cover.assetId,
          secureUrl:
            selectedVariant?.imageRef?.secureUrl ||
            product.images.cover.secureUrl,
        },
        underCover: product.images.underCover, // Mantém a mesma underCover do produto
        gallery: product.images.gallery, // Mantém a galeria original
      },
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={selectedVariant?.quantity === 0}
      className="mt-4 w-full"
    >
      {selectedVariant?.quantity === 0
        ? "Esgotado"
        : `Adicionar - R$ ${(selectedVariant?.price || product.price).toFixed(2)}`}
    </Button>
  );
};
