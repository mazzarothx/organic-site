"use client";

import useCart from "@/hooks/use-cart";
import { CartProduct, Product, ProductAttribute } from "@/types";
import Image from "next/legacy/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ProductCardProps {
  product: Product;
  attributes: ProductAttribute[];
}

const ProductCard: React.FC<ProductCardProps> = ({ product, attributes }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(
    product.properties.minQuantity,
  );
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const [loading, setLoading] = useState(false);
  const cart = useCart();
  const groupedSubAttributes = useMemo(() => {
    const grouped: { [key: string]: { name: string; value: string }[] } = {};

    product.variations.forEach((variation) => {
      variation.subAttributes?.forEach((subAttribute) => {
        const attribute = attributes.find((attr) =>
          attr.productSubAttributes.some(
            (sub) => sub.id === subAttribute.subAttributeId,
          ),
        );

        const attributeName = attribute?.name || "Desconhecido";

        if (!grouped[attributeName]) {
          grouped[attributeName] = [];
        }

        const fullSubAttribute = attribute?.productSubAttributes.find(
          (sub) => sub.id === subAttribute.subAttributeId,
        );

        if (
          fullSubAttribute &&
          !grouped[attributeName].some(
            (sub) =>
              sub.name === fullSubAttribute.name &&
              sub.value === fullSubAttribute.value,
          )
        ) {
          grouped[attributeName].push({
            name: fullSubAttribute.name,
            value: fullSubAttribute.value,
          });
        }
      });
    });

    return grouped;
  }, [product.variations, attributes]);

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
    setLoading(true);

    const cartItems = cart.items;
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += currentQuantity;
      cart.updateItem(existingItem.id, existingItem);
    } else {
      const newCartProduct: CartProduct = {
        id: product.id,
        slug: product.slug,
        productId: product.id,
        variationId: product.variations[0].variationId,
        subAttributes: product.variations[0].subAttributes
          ? product.variations[0].subAttributes
              .map((sub) => sub.name)
              .join(" | ")
          : null,
        name: product.name,
        image: product.images.cover.secureUrl,
        price: product.variations[0].price,
        quantity: currentQuantity,
        availableQuantity: product.variations[0].quantity,
        minQuantity: product.properties.minQuantity,
        multiQuantity: product.properties.multiQuantity,
      };

      cart.addItem(newCartProduct);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setButtonState("success");
    setTimeout(() => setButtonState("idle"), 2000);
    setLoading(false);
  };

  return (
    <div
      className="bg-background flex h-full w-64 flex-col rounded-xl border p-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex aspect-square w-full rounded-t-xl">
        <Link href={`/shop/${product.slug}`}>
          <Image
            className="bg-foreground/10 rounded-xl object-cover"
            src={product.images.cover.secureUrl}
            alt={product.name}
            layout="fill"
          />
        </Link>
        {/* Exibe a tag "PROMOÇÃO" apenas se minPrice for diferente de maxPrice */}
        {minPrice !== maxPrice && (
          <div className="bg-accent absolute top-3 left-3 rounded px-2 py-1">
            <p className="text-xs font-semibold text-white">PROMOÇÃO</p>
          </div>
        )}
        {/* Botão do carrinho com efeito de fade-in */}
        {/* <div
          className={clsx(
            "absolute right-3 bottom-3 transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0", 
          )}
        >
          <Button
            variant="default"
            onClick={handleAddToCart}
            disabled={loading}
            className="h-12 w-12 cursor-pointer rounded-full"
          >
            {buttonState === "loading" ? (
              <Loader size={22} className="animate-spin" />
            ) : buttonState === "success" ? (
              <Check size={22} className="text-accent" />
            ) : (
              <ShoppingCart size={22} />
            )}
          </Button>
        </div> */}
      </div>

      <div className="mt-3 flex h-full w-full flex-col gap-5">
        {/* Nome do produto */}
        <div className="flex flex-col items-start justify-end">
          <Link href={`/shop/${product.slug}`}>
            <div className="h-10 text-sm font-semibold">{product.name}</div>
          </Link>
        </div>

        {/* Cores do produto */}
        <div className="flex items-center justify-between px-1">
          <div className="">
            {Object.entries(groupedSubAttributes).map(
              ([attributeName, subAttributes]) => (
                <div key={attributeName}>
                  <div className="ml-1 flex flex-wrap">
                    {subAttributes.map((subAttribute, index) => (
                      <div
                        key={index}
                        className="-ml-1.5 flex items-center gap-2"
                      >
                        {attributeName.toLowerCase() === "cor" ? (
                          <div
                            className="border-background h-5 w-5 rounded-full border-3"
                            style={{ backgroundColor: subAttribute.value }}
                          />
                        ) : (
                          <div />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Preço do produto */}
          <div className="flex flex-col items-end justify-end">
            {minPrice === maxPrice ? (
              <span className="text-md font-bold">${minPrice.toFixed(2)}</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-foreground/30 text-sm font-normal line-through">
                  ${maxPrice.toFixed(2)}
                </span>
                <span className="text-md font-semibold">
                  ${minPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
