import { db } from "@/app/(auth)/lib/db";
import {
  Product,
  ProductImages,
  ProductProperties,
  ProductVariation,
  Shipping,
} from "@/types";
import { ProductCategory } from "@prisma/client";
import ProductFilterClient from "./shop-filter-client";

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

const fetchAttributes = async () => {
  return await db.productAttribute.findMany({
    include: {
      productSubAttributes: true,
    },
  });
};

const fetchCategories = async (): Promise<ProductCategory[]> => {
  const categories = await db.productCategory.findMany({});
  return categories.map((category) => ({
    ...category,
    imageUrl: category.imageUrl ?? null,
  }));
};

const ProductFilterPage = async () => {
  const [products, attributes, categories] = await Promise.all([
    fetchProducts(),
    fetchAttributes(),
    fetchCategories(),
  ]);

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
