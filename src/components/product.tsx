"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductProps {
  src: string;
  name: string;
  variation: string;
}
const IoProduct = ({ src, name, variation }: ProductProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-12 w-12 rounded-xl">
        <AvatarImage src={src} className="object-cover" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <p className="text-sm">{name}</p>
        <p className="text-textactive text-sm">{variation}</p>
      </div>
    </div>
  );
};

export default IoProduct;
