"use client";

import { ProductWithDetails, SelectedVariant } from "@/types";
import { useState } from "react";
import { AddToCartButton } from "./add-to-cart-button";
import { VariantSelector } from "./variant-selector";

interface ProductDetailsProps {
  product: ProductWithDetails;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<SelectedVariant | null>(null);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Galeria de imagens */}
      <div>{/* ... conteúdo da galeria ... */}</div>

      {/* Informações do produto */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <VariantSelector
          product={product}
          onVariantChange={(selected) => setSelectedVariant(selected)}
        />

        <AddToCartButton product={product} selectedVariant={selectedVariant} />
      </div>
    </div>
  );
}
