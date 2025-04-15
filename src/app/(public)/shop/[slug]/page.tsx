// @/app/(public)/shop/[slug]/page.tsx
import getAttributes from "@/actions/get-attributes";
import getProduct from "@/actions/get-product";
import getSubAttributes from "@/actions/get-sub-attributes";
import { ProductVariation } from "@/types";
import { notFound } from "next/navigation";
import ProductPageClient from "./_components/product-client";

type Params = Promise<{ slug: string }>;

const ProductsPage = async (props: { params: Params }) => {
  // Acessa os parâmetros de forma segura
  const params = await props.params;

  if (!params) {
    console.error("Slug is missing");
    return notFound();
  }

  try {
    // Busca o produto primeiro pois precisamos dele para filtrar os outros dados
    const product = await getProduct(params.slug).catch(() => null);

    if (!product) {
      return notFound();
    }

    // Extrai as variações do produto
    const variations = product.variations as ProductVariation[];

    // Obtém todos os IDs de subatributos das variações
    const relevantSubAttrIds =
      variations?.flatMap((variation) =>
        variation.attributes.flatMap((attr) =>
          attr.subAttributes.map((subAttr) => subAttr.subAttributeId),
        ),
      ) || [];

    // Busca todos os atributos e subatributos em paralelo
    const [allAttributes, allSubAttributes] = await Promise.all([
      getAttributes().catch(() => []),
      getSubAttributes().catch(() => []),
    ]);

    // Filtra os subatributos relevantes
    const subAttributes = allSubAttributes.filter((subAttr) =>
      relevantSubAttrIds.includes(subAttr.id),
    );

    // Obtém os IDs dos atributos relacionados aos subatributos filtrados
    const relevantAttrIds = [
      ...new Set(subAttributes.map((subAttr) => subAttr.productAttributeId)),
    ];

    // Filtra os atributos relevantes
    const attributes = allAttributes
      .filter((attr) => relevantAttrIds.includes(attr.id))
      .sort((a, b) => a.name.localeCompare(b.name)); // Ordena por nome

    return (
      <ProductPageClient
        initialData={product}
        attributes={attributes}
        subAttributes={subAttributes}
      />
    );
  } catch (error) {
    console.error("Product page error:", error);
    // return <ErrorPage error={error} tryAgainLink={`/shop/${slug}`} />;
  }
};

export default ProductsPage;
