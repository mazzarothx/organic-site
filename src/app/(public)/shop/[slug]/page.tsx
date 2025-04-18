import getAttributes from "@/actions/get-attributes";
import getMappedProduct from "@/hooks/use-product";
import { notFound } from "next/navigation";
import ProductPageClient from "./_components/product-client";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  try {
    const [product, attributes] = await Promise.all([
      getMappedProduct(slug),
      getAttributes(),
    ]);

    if (!product) {
      console.warn(`Product not found for slug: ${slug}`);
      return notFound();
    }

    if (!product.variations || product.variations.length === 0) {
      console.error(`Product has no variations: ${product.id}`);
      return notFound();
    }

    // Adicione os atributos diretamente ao product
    const productWithAttributes = {
      ...product,
      attributes: attributes.filter((attr) =>
        product.variations.some((variation) =>
          variation.attributes.some((a) => a.attributeId === attr.id),
        ),
      ),
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <ProductPageClient
          initialData={productWithAttributes} // Passe tudo em initialData
        />
      </div>
    );
  } catch (error) {
    console.error(`Error loading product page [${slug}]:`, error);
    return notFound();
  }
}
