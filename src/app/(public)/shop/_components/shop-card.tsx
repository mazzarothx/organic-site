/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ShopCardProps {
  product: Product;
}

const ShopCard: React.FC<ShopCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const cart = useCart();

  // Agrupa subatributos por nome do atributo
  const groupedAttributes = useMemo(() => {
    const grouped: { [key: string]: { name: string; value: string }[] } = {};

    // Usa os atributos das variações para agrupar
    product.variations.forEach((variation) => {
      variation.attributes.forEach((attr) => {
        if (!grouped[attr.attributeName]) {
          grouped[attr.attributeName] = [];
        }

        attr.subAttributes.forEach((subAttr) => {
          const existing = grouped[attr.attributeName].find(
            (item) =>
              item.name === subAttr.subAttributeName &&
              item.value === (subAttr as any).value,
          );

          if (!existing) {
            grouped[attr.attributeName].push({
              name: subAttr.subAttributeName,
              value: (subAttr as any).value || "",
            });
          }
        });
      });
    });

    return grouped;
  }, [product.variations]);

  // Calcula preço mínimo e máximo
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

  const handleAddToCart = async () => {
    setButtonState("loading");

    const firstVariation = product.variations[0];

    const cartProduct = {
      id: product.id,
      slug: product.slug,
      productId: product.id,
      variationId: firstVariation.id,
      subAttributes: firstVariation.attributes
        .map((attr) =>
          attr.subAttributes.map((sub) => sub.subAttributeName).join(", "),
        )
        .join(" | "),
      name: product.name,
      image: product.images.cover.secureUrl,
      price: firstVariation.price,
      salePrice: firstVariation.salePrice,
      quantity: 1,
      availableQuantity: firstVariation.quantity,
      minQuantity: product.properties.minQuantity,
      multiQuantity: product.properties.multiQuantity,
    };

    cart.addItem(cartProduct);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setButtonState("success");
    setTimeout(() => setButtonState("idle"), 2000);
  };

  return (
    <div
      className="bg-background flex h-full w-full flex-col rounded-xl border p-3 transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem do produto */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-xl">
        <Link href={`/shop/${product.slug}`}>
          <Image
            src={product.images.cover.secureUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Tags */}
        {product.properties.label.sale.state && (
          <div className="bg-accent absolute top-3 left-3 rounded px-2 py-1">
            <p className="text-xs font-semibold text-white">
              {product.properties.label.sale.value}
            </p>
          </div>
        )}
        {product.properties.label.new.state && (
          <div className="bg-primary absolute top-3 right-3 rounded px-2 py-1">
            <p className="text-xs font-semibold text-white">
              {product.properties.label.new.value}
            </p>
          </div>
        )}

        {/* Botão do carrinho */}
        <div
          className={`absolute right-3 bottom-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={buttonState !== "idle"}
            className="h-10 w-10 rounded-full"
          >
            {buttonState === "loading" ? (
              <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            ) : buttonState === "success" ? (
              <span className="text-sm">✓</span>
            ) : (
              <ShoppingCart size={16} />
            )}
          </Button>
        </div>
      </div>

      {/* Informações do produto */}
      <div className="mt-3 flex flex-1 flex-col gap-2">
        {/* Nome do produto */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="hover:text-primary line-clamp-2 text-sm font-semibold">
            {product.name}
          </h3>
        </Link>

        {/* Atributos */}
        <div className="mt-1 flex flex-wrap gap-1">
          {Object.entries(groupedAttributes).map(
            ([attributeName, subAttributes]) => (
              <div key={attributeName} className="flex items-center gap-1">
                {subAttributes.map((subAttr, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center"
                    title={`${attributeName}: ${subAttr.name}`}
                  >
                    {attributeName.toLowerCase() === "cor" ? (
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: subAttr.value }}
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        {subAttr.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ),
          )}
        </div>

        {/* Preço */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {minPrice !== maxPrice ? (
              <>
                <span className="text-muted-foreground text-sm font-medium line-through">
                  R$ {maxPrice.toFixed(2)}
                </span>
                <span className="text-primary text-lg font-bold">
                  R$ {minPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">
                R$ {minPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
