import { Product, ProductAttribute, ProductCategory } from "@/types/product";
import ProductFilterClient from "./shop-filter-client";

const fetchShopData = async () => {
  try {
    const [productsRes, attributesRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/products`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/attributes`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/categories`),
    ]);

    if (!productsRes.ok || !attributesRes.ok || !categoriesRes.ok) {
      throw new Error("Failed to fetch shop data");
    }

    const products: Product[] = await productsRes.json();
    const attributes: ProductAttribute[] = await attributesRes.json();
    const categories: ProductCategory[] = await categoriesRes.json();

    return { products, attributes, categories };
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return { products: [], attributes: [], categories: [] };
  }
};

const ProductFilterPage = async () => {
  const { products, attributes, categories } = await fetchShopData();

  return (
    <div className="bg-background min-h-screen">
      <ProductFilterClient
        initialProducts={products}
        attributes={attributes}
        categories={categories}
      />
    </div>
  );
};

export default ProductFilterPage;
