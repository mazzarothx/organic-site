"use client";

import Counter from "@/components/card/counter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CartProduct, Product } from "@/types";
import { Check, Loader, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "../ui/separator";

interface CurrencyCardProps {
  data: Product;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({ data }) => {
  const cart = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [currentQuantity, setCurrentQuantity] = React.useState(
    data.properties.minQuantity,
  );
  const [buttonState, setButtonState] = React.useState<
    "idle" | "loading" | "success"
  >("idle");

  if (!data) {
    return null;
  }

  const handleQuantityChange = (quantity: number) => {
    if (quantity !== currentQuantity) {
      setCurrentQuantity(quantity);
    }
  };

  const handleAddToCart = async () => {
    setButtonState("loading");

    setLoading(true);

    const cartItems = cart.items;
    const existingItem = cartItems.find((item) => item.id === data.id);

    if (existingItem) {
      existingItem.quantity += currentQuantity;
      cart.updateItem(existingItem.id, existingItem);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setButtonState("success");

      // Exibe o ícone de sucesso por 2 segundos
      setTimeout(() => {
        setButtonState("idle");
      }, 2000);
      setLoading(false);

      return;
    }

    const newCartProduct: CartProduct = {
      id: data.id,
      slug: data.slug,
      productId: data.id,
      variationId: data.variations[0].id,
      subAttributes: data.variations[0].attributes
        ? data.variations[0].attributes
            .flatMap((attr) => attr.subAttributes)
            .map((sub) => sub.subAttributeName)
            .join(" | ")
        : null,
      name: data.name,
      image: data.images.cover.secureUrl,
      price: data.variations[0].price,
      quantity: currentQuantity,
      availableQuantity: data.variations[0].quantity,
      minQuantity: data.properties.minQuantity,
      multiQuantity: data.properties.multiQuantity,
    };

    cart.addItem(newCartProduct);

    // Simulando carregamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setButtonState("success");

    // Exibe o ícone de sucesso por 2 segundos
    setTimeout(() => {
      setButtonState("idle");
    }, 2000);

    setLoading(false);
  };

  return (
    <div key={data.id} className="group aspect-[9/12] bg-[#22222c] p-6 pt-2">
      <div className="relative mx-auto flex aspect-square h-40 w-40 items-center justify-center">
        <Image
          src={data.images.cover.secureUrl}
          width={300}
          height={300}
          alt={data.name}
          className="aspect-square object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 pt-3">
        <div className="text-textprimary text-center text-base font-bold">
          {data.name}
        </div>
        <Separator className="bg-textprimary/20" />
        <Counter
          minQuantity={data.properties.minQuantity}
          maxQuantity={data.variations[0].quantity}
          multiQuantity={data.properties.multiQuantity}
          price={data.variations[0].price}
          onChange={handleQuantityChange}
        />
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="default"
            className=""
            onClick={handleAddToCart}
            disabled={loading}
          >
            {buttonState === "loading" ? (
              <Loader size={22} className="animate-spin" />
            ) : buttonState === "success" ? (
              <Check size={22} className="text-accent" />
            ) : (
              <ShoppingCart size={22} />
            )}
          </Button>
          <Button
            className="flex h-8 w-32 items-center rounded-none text-xs leading-4 font-semibold text-black"
            onClick={() => {
              handleAddToCart();
              router.push("/cart");
            }}
          >
            BUY NOW
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCard;
