import getAttributes from "@/actions/get-attributes";
import getCategories from "@/actions/get-categories";
import { getMappedProducts } from "@/hooks/use-products";
import ProductFilterClient from "./shop-filter-client";

const ProductFilterPage = async () => {
  const [products, attributes, categories] = await Promise.all([
    getMappedProducts(),
    getAttributes(),
    getCategories(),
  ]);

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
