"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-cart";
import { formatterBr } from "@/lib/utils";

import { ShoppingCart } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuTrash } from "react-icons/lu";
import { CartProduct } from "../../types";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Quantity from "./quantity";

export function CartModal({}) {
  const cart = useCart();
  return (
    <Sheet>
      <SheetTrigger className="flex items-center justify-center" asChild>
        <Button variant="icon">
          <div className="relative flex h-5 w-5 items-center justify-center">
            <span className="bg-accent absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] font-medium text-black">
              {cart.items.length}
            </span>
            <ShoppingCart size={22} />
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-background/70 shadow-sm saturate-100 backdrop-blur transition-colors duration-500 ease-in-out"
      >
        <div className="flex h-full flex-col justify-between">
          <Header />
          <Content />
          <Footer />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Header() {
  // const cart = useCart();
  return (
    <SheetHeader className="p-4">
      <SheetTitle>Meu carrinho</SheetTitle>
      {/* <SheetDescription>
        {cart.items.length === 0
          ? "Seu carrinho esta vazio"
          : `Você possui ${cart.items.length} item(s) em seu carrinho`}
      </SheetDescription> */}
    </SheetHeader>
  );
}

// #region Content
function Content() {
  const cart = useCart();
  return (
    <ScrollArea className="h-full">
      <div className="mb-6 flex h-full flex-col gap-12 px-4">
        {cart.items.length === 0 ? (
          <div className="flex h-[550px] flex-col items-center justify-center gap-4">
            <Image
              src="/illustrations/illustration_empty_cart.svg"
              width={350}
              height={350}
              alt="empty cart"
            />
            <p className="text-textunactive text-sm font-semibold">
              carrinho vazio
            </p>
          </div>
        ) : (
          <div>
            {cart.items.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface ProductCardProps {
  product: CartProduct;
}
function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();
  const handleRemoveItem = (id: string) => {
    cart.removeItem(id);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    cart.updateQuantity(id, quantity);
  };

  return (
    <div className="flex h-32 w-full items-center">
      <Image
        src={product.image}
        alt="product"
        width={90}
        height={90}
        className="bg-foreground/10 rounded-xl object-cover p-2"
      />
      <div className="ml-4 flex w-full flex-col justify-between">
        <div className="flex w-full items-center justify-between">
          <p className="text-primary text-sm font-semibold">{product.name}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            onClick={() => handleRemoveItem(product.id)}
          >
            <LuTrash />
          </Button>
        </div>
        <p className="text-dash-text-secondary text-xs">
          {product.subAttributes}
        </p>
        <div className="mt-3 flex w-full items-center justify-between">
          <Quantity
            quantity={product.quantity}
            availableQuantity={product.availableQuantity}
            onIncrement={() =>
              handleUpdateQuantity(product.id, product.quantity + 1)
            }
            onDecrement={() =>
              handleUpdateQuantity(product.id, product.quantity - 1)
            }
            showAvailableQuantity={false}
          />
          <p className="text-dash-text-secondary pr-[10px] text-sm">
            {formatterBr.format(product.price * product.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

// #endregion

// #region Footer

function Footer() {
  const items = useCart((state) => state.items);
  const router = useRouter();
  const cart = useCart();

  const subTotalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  return (
    <div className="bg-dash-background-secondary flex flex-col gap-6 px-4 py-6">
      {cart.items.length === 0 ? (
        <div className="hidden"></div>
      ) : (
        <div className="bg-dash-background-secondary flex flex-col gap-6 px-4 py-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-dash-text-secondary text-sm">Sub Total</p>
              <p className="text-dash-text-primary text-sm">
                {formatterBr.format(subTotalPrice)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-dash-text-secondary text-sm">Desconto</p>
              <p className="text-dash-text-primary text-sm">R$ 0,00</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-dash-text-secondary text-sm">Frete</p>
              <p className="text-dash-text-primary text-sm">R$ 0,00</p>
            </div>
            <Separator className="border-dash-input-border my-2 border border-dashed bg-transparent" />
            <div className="flex items-center justify-between">
              <p className="text-dash-text-primary text-base">Total</p>
              <p className="text-dash-error-light text-sm">
                {formatterBr.format(subTotalPrice)}
              </p>
            </div>
          </div>
          <SheetClose
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-full rounded-md text-sm font-medium uppercase shadow-xs transition-colors"
            onClick={() => {
              router.push("/shop/cart?step=0");
            }}
          >
            checkout
          </SheetClose>
        </div>
      )}
    </div>
  );
}

// #endregion
