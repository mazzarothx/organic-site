import { ProductVariant, ProductWithDetails } from "@/types";

// Gerar chave composta para variante
export const generateCompositeKey = (variant: ProductVariant): string => {
  return variant.attributes
    .map(
      (attr) => `${attr.attributeName}:${attr.subAttributes[0].subAttributeId}`,
    )
    .join("|");
};

// Encontrar variante por chave composta
export const findVariantByCompositeKey = (
  product: ProductWithDetails,
  compositeKey: string,
): ProductVariant | undefined => {
  return product.variations.find((variant) => {
    const variantKey = generateCompositeKey(variant);
    return variantKey === compositeKey;
  });
};

// Verificar se produto tem variações disponíveis
export const hasAvailableVariations = (
  product: ProductWithDetails,
): boolean => {
  return (
    product.type === "VARIABLE" &&
    product.variations.length > 0 &&
    product.variations.some((v) => v.quantity > 0)
  );
};

// Obter preço mínimo/máximo para exibição
export const getPriceRange = (
  product: ProductWithDetails,
): { min: number; max: number } => {
  if (product.type === "SIMPLE" || product.variations.length === 0) {
    const price = product.variations[0]?.price || 0;
    return { min: price, max: price };
  }

  const prices = product.variations.map((v) => v.salePrice || v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
