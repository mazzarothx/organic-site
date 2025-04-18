import getAttributes from "@/actions/get-attributes";
import getCategories from "@/actions/get-categories";
import { getMappedProducts } from "@/hooks/use-products";
import ProductFilterClient from "./_components/shop-filter-client";

export default async function ShopPage() {
  const [products, attributes, categories] = await Promise.all([
    getMappedProducts(),
    getAttributes(),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Nossos Produtos</h1>

      <ProductFilterClient
        initialProducts={products}
        attributes={attributes}
        categories={categories}
      />
    </div>
  );
}
