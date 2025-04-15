"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface CounterProps {
  minQuantity: number;
  maxQuantity: number;
  multiQuantity: number;
  price: number;
  onChange: (count: number) => void;
}

export default function Counter({
  minQuantity,
  maxQuantity,
  multiQuantity,
  price,
  onChange,
}: CounterProps) {
  const [count, setCount] = useState<number>(minQuantity);
  const disabledIncrement = count >= maxQuantity;
  const disabledDecrement = count <= minQuantity;

  useEffect(() => {
    onChange(count);
  }, [count, onChange]);

  const increase = () => {
    setCount((prevCount) => {
      const newCount = Number(prevCount) + Number(multiQuantity);
      return newCount <= maxQuantity ? newCount : prevCount;
    });
  };

  const decrease = () => {
    setCount((prevCount) => {
      const newCount = Number(prevCount) - Number(multiQuantity);
      return newCount >= minQuantity ? newCount : prevCount;
    });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (
      !isNaN(newValue) &&
      newValue >= minQuantity &&
      newValue <= maxQuantity
    ) {
      setCount(newValue);
    }
  };

  const totalPrice = (count * price).toFixed(2);

  return (
    <div className="mx-auto w-full max-w-md py-4">
      <div className="mb-4 flex items-center justify-center space-x-4">
        <Button
          onClick={decrease}
          className="h-8 w-8"
          disabled={disabledDecrement}
        >
          -
        </Button>
        <Input
          type="number"
          value={count}
          onChange={handleCountChange}
          className="w-16 text-center text-textprimary"
        />

        <Button
          onClick={increase}
          className="h-8 w-8"
          disabled={disabledIncrement}
        >
          +
        </Button>
      </div>
      <div className="pt-3 text-center">
        <p className="text-lg text-textprimary"> ${totalPrice}</p>
      </div>
    </div>
  );
}
