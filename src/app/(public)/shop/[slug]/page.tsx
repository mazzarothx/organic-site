import { getProduct } from "@/actions/get-product";
import { notFound } from "next/navigation";
import { ProductDetails } from "./_components/product-details";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  );
}
