// src/hooks/use-product.ts
import { Product, ProductAttribute } from "@/types";
import { useMemo } from "react";

interface UseProductOptions {
  forCart?: boolean;
  forCard?: boolean;
  forProductPage?: boolean;
}

export const useProduct = (
  product: Product,
  attributes: ProductAttribute[] = [],
  options: UseProductOptions = {},
) => {
  // Calcula preços mínimo e máximo
  const { minPrice, maxPrice } = useMemo(() => {
    if (!product.variations || product.variations.length === 0) {
      return { minPrice: 0, maxPrice: 0 };
    }

    let minPrice =
      product.variations[0].salePrice || product.variations[0].price;
    let maxPrice =
      product.variations[0].salePrice || product.variations[0].price;

    product.variations.forEach((variation) => {
      const currentPrice = variation.salePrice || variation.price;
      if (currentPrice < minPrice) minPrice = currentPrice;
      if (currentPrice > maxPrice) maxPrice = currentPrice;
    });

    return { minPrice, maxPrice };
  }, [product.variations]);

  // Agrupa subatributos por atributo (útil para cards)
  const groupedSubAttributes = useMemo(() => {
    const grouped: { [key: string]: { name: string; value: string }[] } = {};

    product.variations.forEach((variation) => {
      variation.attributes.forEach((attribute) => {
        const foundAttribute = attributes.find(
          (attr) => attr.id === attribute.attributeId,
        );

        if (foundAttribute) {
          if (!grouped[foundAttribute.name]) {
            grouped[foundAttribute.name] = [];
          }

          attribute.subAttributes.forEach((subAttribute) => {
            const foundSubAttr = foundAttribute.productSubAttributes.find(
              (sub) => sub.id === subAttribute.subAttributeId,
            );

            if (
              foundSubAttr &&
              !grouped[foundAttribute.name].some(
                (sub) =>
                  sub.name === foundSubAttr.name &&
                  sub.value === foundSubAttr.value,
              )
            ) {
              grouped[foundAttribute.name].push({
                name: foundSubAttr.name,
                value: foundSubAttr.value,
              });
            }
          });
        }
      });
    });

    return grouped;
  }, [product.variations, attributes]);

  // Versão para cards
  const cardProduct = useMemo(() => {
    if (!options.forCard) return null;

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images.cover.secureUrl,
      minPrice,
      maxPrice,
      groupedSubAttributes,
      isOnSale: minPrice !== maxPrice,
      featured: product.featured,
      labels: product.properties.label,
      minQuantity: product.properties.minQuantity,
      category: product.category,
      subcategory: product.subcategory,
    };
  }, [product, minPrice, maxPrice, groupedSubAttributes, options.forCard]);

  // Versão para página de produto
  const productPageProduct = useMemo(() => {
    if (!options.forProductPage) return null;

    return {
      ...product,
      variations: product.variations.map((variation) => ({
        ...variation,
        attributes: variation.attributes.map((attr) => {
          const foundAttribute = attributes.find(
            (a) => a.id === attr.attributeId,
          );
          return {
            ...attr,
            attributeName: foundAttribute?.name || attr.attributeName,
            subAttributes: attr.subAttributes.map((subAttr) => {
              const foundSubAttr = foundAttribute?.productSubAttributes.find(
                (s) => s.id === subAttr.subAttributeId,
              );
              return {
                ...subAttr,
                subAttributeName:
                  foundSubAttr?.name || subAttr.subAttributeName,
                value: foundSubAttr?.value,
              };
            }),
          };
        }),
      })),
      minPrice,
      maxPrice,
    };
  }, [product, attributes, minPrice, maxPrice, options.forProductPage]);

  // Versão para carrinho
  const cartProduct = useMemo(() => {
    if (!options.forCart) return null;

    // Assume a primeira variação como padrão para o carrinho
    // Na prática, você deve permitir selecionar a variação
    const defaultVariation = product.variations[0];

    return {
      id: product.id,
      slug: product.slug,
      productId: product.id,
      variationId: defaultVariation.id,
      subAttributes: defaultVariation.attributes
        .flatMap((attr) =>
          attr.subAttributes.map((subAttr) => subAttr.subAttributeName),
        )
        .join(" | "),
      name: product.name,
      image: product.images.cover.secureUrl,
      price: defaultVariation.salePrice || defaultVariation.price,
      quantity: product.properties.minQuantity,
      availableQuantity: defaultVariation.quantity,
      minQuantity: product.properties.minQuantity,
      multiQuantity: product.properties.multiQuantity,
    };
  }, [product, options.forCart]);

  return {
    cardProduct,
    productPageProduct,
    cartProduct,
    groupedSubAttributes,
    priceRange: { minPrice, maxPrice },
  };
};
