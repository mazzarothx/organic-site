"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCart from "@/hooks/use-cart";
import { formatterBr } from "@/lib/utils";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Quantity from "../../../../components/cart/quantity";

export default function CartTable() {
  const cart = useCart();
  const handleRemoveItem = (id: string) => {
    cart.removeItem(id);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    cart.updateQuantity(id, quantity);
  };

  return (
    <Card className="h-fit min-h-96 w-full">
      <CardContent className="p-0">
        <p className="pt-5 pb-6 pl-6 text-lg font-bold">
          Cart
          <span className="ml-1 text-white/50">({cart.items.length} item)</span>
        </p>
        {cart.items.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center p-10">
            <Image
              src="/assets/io-cart.svg"
              width={160}
              height={160}
              alt="io-cart"
            />
            <p className="text-dash-text-secondary text-lg">Cart is empty</p>
            <p className="text-dash-text-secondary text-sm">
              Look like you have no items in your shopping cart.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-dash-background-tertiary h-14">
              <TableRow>
                <TableHead className="pl-4">Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.items.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-dash-background-tertiary h-24 border-b border-dashed"
                >
                  <TableCell className="w-[55%] p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt="logo"
                        width={64}
                        height={64}
                        className="rounded-xl"
                      />
                      <div>
                        <Link href={`/shop/${item.slug}`}>
                          <p className="text-dash-text-primary"> {item.name}</p>
                        </Link>
                        <p className="text-dash-text-secondary pt-1 text-sm">
                          {item.subAttributes}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatterBr.format(item.price)}</TableCell>
                  <TableCell>
                    <Quantity
                      quantity={item.quantity}
                      onIncrement={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      onDecrement={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      availableQuantity={item.availableQuantity}
                    />
                  </TableCell>
                  <TableCell>
                    {formatterBr.format(item.price * item.quantity)}
                  </TableCell>
                  <TableCell className="w-8 pr-6">
                    <Button
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function QuantityButton() {
  return null;
}
