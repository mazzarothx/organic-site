// src/app/(public)/shop/products/page.tsx (Server Component)
import { db } from "@/app/(auth)/lib/db";
import {
  Product,
  ProductImages,
  ProductProperties,
  ProductVariation,
  Shipping,
} from "@/types";
import { ProductCategory } from "@prisma/client";
import ProductFilterClient from "./_components/shop-filter-client";

const ProductFilterPage = async () => {
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

  const attributes = await db.productAttribute.findMany({
    include: {
      productSubAttributes: true,
    },
  });

  const categories: ProductCategory[] = (
    await db.productCategory.findMany({})
  ).map((category) => ({
    ...category,
    imageUrl: category.imageUrl ?? null,
  }));

  return (
    <div>
      <ProductFilterClient
        initialProducts={products}
        attributes={attributes}
        categories={categories}
      />
    </div>
  );
};

export default ProductFilterPage;
