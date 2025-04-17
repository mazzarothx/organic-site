"use client";

import { useProduct } from "@/hooks/use-products";
import { Product, ProductAttribute } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  attributes: ProductAttribute[];
}

const ProductCard: React.FC<ProductCardProps> = ({ product, attributes }) => {
  const { cardProduct, groupedSubAttributes, priceRange } = useProduct(
    product,
    attributes,
    { forCard: true },
  );

  if (!cardProduct) return null;

  return (
    <Link href={`/shop/${cardProduct.slug}`} className="group">
      <div className="bg-background flex h-full flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
        {/* Imagem do produto */}
        <div className="relative aspect-square">
          <Image
            src={cardProduct.image}
            alt={cardProduct.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {cardProduct.isOnSale && (
            <div className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
              PROMOÇÃO
            </div>
          )}
        </div>

        {/* Informações do produto */}
        <div className="flex flex-grow flex-col p-4">
          <h3 className="group-hover:text-primary mb-2 text-lg font-medium transition-colors">
            {cardProduct.name}
          </h3>

          {/* Atributos (cores) */}
          <div className="mt-auto">
            {Object.entries(groupedSubAttributes).map(
              ([attributeName, subAttributes]) => (
                <div key={attributeName} className="mb-2 flex gap-1">
                  {subAttributes.map(
                    (subAttribute, index) =>
                      attributeName.toLowerCase() === "cor" && (
                        <div
                          key={index}
                          className="h-5 w-5 rounded-full border"
                          style={{ backgroundColor: subAttribute.value }}
                          title={subAttribute.name}
                        />
                      ),
                  )}
                </div>
              ),
            )}

            {/* Preço */}
            <div className="mt-2">
              {priceRange.minPrice === priceRange.maxPrice ? (
                <span className="font-bold">
                  ${priceRange.minPrice.toFixed(2)}
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through">
                    ${priceRange.maxPrice.toFixed(2)}
                  </span>
                  <span className="text-primary font-bold">
                    ${priceRange.minPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
