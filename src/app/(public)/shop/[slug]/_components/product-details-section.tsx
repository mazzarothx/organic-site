import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaStar } from "react-icons/fa";

interface ProductDetailsSectionProps {
  name: string;
  price: number;
  originalPrice?: number;
  hasDiscount: boolean;
}

export const ProductDetailsSection = ({
  name,
  price,
  originalPrice,
  hasDiscount,
}: ProductDetailsSectionProps) => (
  <div className="flex w-full max-w-[500px] flex-col gap-4 p-8">
    <Badge className="bg-dash-gray-800 text-dash-text-primary w-fit">
      NOVO
    </Badge>
    <p className="text-dash-primary text-xs font-bold">EM ESTOQUE</p>
    <h1 className="text-xl font-bold">{name}</h1>

    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4].map((star) => (
          <FaStar key={star} className="h-4 w-4 text-yellow-400" />
        ))}
        <FaStar className="text-dash-gray-600 h-4 w-4" />
      </div>
      <span className="text-dash-gray-600 ml-2 text-sm">
        (9.12k avaliações)
      </span>
    </div>

    <Separator className="border border-dashed bg-transparent" />

    {/* Price display */}
    <div className="flex items-center gap-2">
      {hasDiscount && (
        <span className="text-dash-gray-600 line-through">
          {originalPrice?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      )}
      <span className="text-xl font-bold">
        {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
      {hasDiscount && (
        <span className="text-dash-error ml-2 text-sm">
          {Math.round(((originalPrice! - price) / originalPrice!) * 100)}% OFF
        </span>
      )}
    </div>
  </div>
);
