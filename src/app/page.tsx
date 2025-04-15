// src/app/(public)/page.tsx
import { db } from "@/app/(auth)/lib/db";
import {
  Product,
  ProductImages,
  ProductProperties,
  ProductVariation,
  Shipping,
} from "@/types";
import { ProductCategory } from "@prisma/client";
import Paralax from "./(public)/home/paralax";
import SessionBanner from "./(public)/home/session-banner";
import SessionBests from "./(public)/home/session-bests";
import SessionBlog from "./(public)/home/session-blog";
import SessionVitrine from "./(public)/home/session-vitrine";

const fetchProducts = async (): Promise<Product[]> => {
  const products = await db.product.findMany({});
  return products.map((product) => ({
    ...product,
    variations: product.variations as ProductVariation[],
    images: product.images as ProductImages,
    shipping: product.shipping as Shipping,
    properties: product.properties as ProductProperties,
    description: product.description ?? "",
  }));
};

const fetchCategories = async (): Promise<ProductCategory[]> => {
  const categories = await db.productCategory.findMany({});
  return categories.map((category) => ({
    ...category,
    imageUrl: category.imageUrl ?? null,
  }));
};

export default async function Home() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  return (
    <div>
      <SessionBanner />
      <SessionVitrine categories={categories} products={products} />
      <SessionBests />
      <Paralax />
      <SessionBlog />
    </div>
  );
}
