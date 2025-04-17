import getProduct from "@/actions/get-product";
import {
  Product,
  ProductAttribute,
  ProductAttributeAssignment,
  ProductSubAttribute,
} from "@/types";
import { ProductAttributeValue } from "@/types/product";
import { notFound } from "next/navigation";
import ProductPageClient from "./_components/product-client";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

/**
 * Converts ProductAttributeAssignment to ProductAttribute format
 */
const mapToProductAttribute = (
  assignment: ProductAttributeAssignment,
  existingAttributes: ProductAttribute[],
): ProductAttribute => {
  const existingAttribute = existingAttributes.find(
    (attr) => attr.id === assignment.attributeId,
  );

  return {
    id: assignment.attributeId,
    slug: assignment.attributeName.toLowerCase().replace(/\s+/g, "-"),
    name: assignment.attributeName,
    type: existingAttribute?.type || "SELECT",
    productPageType: existingAttribute?.productPageType || "SELECT",
    filterPageType: existingAttribute?.filterPageType || "SELECT",
    createdAt: existingAttribute?.createdAt || new Date(),
    updatedAt: existingAttribute?.updatedAt || new Date(),
    productSubAttributes: existingAttribute?.productSubAttributes || [],
  };
};

/**
 * Converts ProductAttributeValue to ProductSubAttribute format
 */
const mapToProductSubAttribute = (
  value: ProductAttributeValue,
  attributeId: string,
): ProductSubAttribute => ({
  id: value.subAttributeId,
  slug: value.subAttributeName.toLowerCase().replace(/\s+/g, "-"),
  name: value.subAttributeName,
  value: value.subAttributeName,
  productAttributeId: attributeId,
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * Extracts and transforms attributes and subAttributes from product variations
 */
const getProductAttributes = (
  product: Product,
): {
  attributes: ProductAttribute[];
  subAttributes: ProductSubAttribute[];
} => {
  const attributesMap = new Map<string, ProductAttribute>();
  const subAttributesMap = new Map<string, ProductSubAttribute>();

  product.variations?.forEach((variation) => {
    variation.attributes.forEach((assignment) => {
      if (!attributesMap.has(assignment.attributeId)) {
        attributesMap.set(
          assignment.attributeId,
          mapToProductAttribute(
            assignment,
            product.attributes?.map((assignment) =>
              mapToProductAttribute(assignment, []),
            ) || [],
          ),
        );
      }

      assignment.subAttributes.forEach((subAttr) => {
        if (!subAttributesMap.has(subAttr.subAttributeId)) {
          subAttributesMap.set(
            subAttr.subAttributeId,
            mapToProductSubAttribute(subAttr, assignment.attributeId),
          );
        }
      });
    });
  });

  return {
    attributes: Array.from(attributesMap.values()),
    subAttributes: Array.from(subAttributesMap.values()),
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  // Extrai o slug de forma segura
  const { slug } = params;

  let product: Product | null = null;

  try {
    // Usa o slug extraído
    product = await getProduct(slug);

    if (!product) {
      console.warn(`Product not found for slug: ${slug}`);
      return notFound();
    }

    if (!product.variations || product.variations.length === 0) {
      console.error(`Product has no variations: ${product.id}`);
      return notFound();
    }

    const { attributes, subAttributes } = getProductAttributes(product);

    return (
      <div className="container mx-auto px-4 py-8">
        <ProductPageClient
          initialData={product}
          attributes={attributes}
          subAttributes={subAttributes}
        />
      </div>
    );
  } catch (error) {
    console.error(`Error loading product page [${slug}]:`, error);
    return notFound();
  }
}
