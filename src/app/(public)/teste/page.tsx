// src/app/teste/page.tsx
import { db } from "@/app/(auth)/lib/db";
import {
  Product,
  ProductAttribute,
  ProductImages,
  ProductProperties,
  ProductVariation,
  Shipping,
} from "@/types";
import ProductDetailCard from "./card";

const Teste = async () => {
  const products: Product[] = (await db.product.findMany({})).map(
    (product) => ({
      ...product,
      variations: product.variations as ProductVariation[],
      images: product.images as ProductImages,
      shipping: product.shipping as Shipping,
      properties: product.properties as ProductProperties,
      description: product.description ?? "",
    }),
  );

  const attributes: ProductAttribute[] = await db.productAttribute.findMany({
    include: {
      productSubAttributes: true,
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductDetailCard
            key={product.id}
            product={product}
            attributes={attributes} // Passando os atributos como prop
          />
        ))}
      </div>
    </div>
  );
};

export default Teste;
